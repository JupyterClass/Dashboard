import evaluate from "./evaluate";
import { getJson } from "./utils/json";
import { getFileUploadContents } from "./utils/fileUploads";
import {
  NotebookStore,
  QuestionStore,
  getAllQuestions,
  saveNotebook,
  saveNotebookQuestions, getQuestion, getNotebook
} from "./store/question";
import { invalidEndpoint, invalidPayloadError } from "./errors";
import { getStudent, saveStudent, setStudentProgress, StudentStore } from "./store/student";

export default {

  '/join': async (req, res) => {
    let { studentId, practiceId, secret } = await getJson(req);

    if (getNotebook(practiceId)) {
      saveStudent(studentId);
      res.end(JSON.stringify({ status: 'success', msg: 'Joined session successfully!' }));
    } else {
      console.log(studentId, 'tried to join', practiceId, "which doesn't exist!");
      res.end(JSON.stringify({ status: 'error', msg: "Tried to join a practice session that doesn't exist!"}));
    }
  },

  '/sync-stores': async (req, res) => {
    // For the client to synchronise its store with the server's
    res.end(JSON.stringify({ NotebookStore, QuestionStore, StudentStore }));
  },

  '/upload': async (req, res) => {
    if (req.method.toLowerCase() !== 'post') {
      res.end(invalidEndpoint());
      return;
    }

    try {
      let { fileName, contents: notebook } = await getFileUploadContents(req, { ext: '.ipynb' });
      notebook = {
        id: fileName,
        data: JSON.parse(notebook)
      };

      try {
        verifyMetadata(notebook.data);
      } catch(err) {
        res.statusCode = 400;
        res.statusMessage = err;
        res.end();
        return;
      }

      saveNotebook(notebook);
      saveNotebookQuestions(notebook);

    } catch (err) {
      console.error(err);
      res.statusCode = 400;
      res.statusMessage = err;
    }
    res.end();
  },

  '/evaluate': async (req, res) => {
    let payload;
    try {
      payload = await getJson(req);
    } catch (err) {
      res.end(invalidPayloadError());
      return;
    }

    if (isValidPayload(payload)) {
      const { studentId, practiceId, questionId, output } = payload;

      if (!getStudent(studentId)) {
        console.log('Student ' + studentId + ' not found in Student store. Did she join with the correct secret?');
        return
      }

      const expectedOutput = getQuestion(practiceId, questionId).expected;

      const evaluation = evaluate(output, expectedOutput);

      // TODO: Update student store with student's completeness
      setStudentProgress({
        studentId,
        practiceId,
        questionId,
        completeness: evaluation.result === 'OK' ? 1 : 0
      });

      res.end(JSON.stringify({
        type: 'qn-eval',
        evaluation,
        metadata: {
          studentId, practiceId, questionId
        },
      }));
    } else {
      res.end(invalidPayloadError());
    }
  },

  '/questions': async (req, res) => {
    res.end(JSON.stringify(getAllQuestions()));
  },

  '/': async (req, res, next) => {
    res.end(JSON.stringify({ hello: 'world!' }));
  },
};

function isValidPayload(payload) {
  return (
    payload &&
    'studentId' in payload &&
    'practiceId' in payload &&
    'questionId' in payload &&
    'output' in payload
  )
}

function verifyMetadata(notebook) {
  if (!('JupyterClass' in notebook['metadata'])) {
    throw Error(`Missing JupyterClass configs. Ensure that the notebook metadata contains a 'JupyterClass' key...`);
  }
  const { metadata } = notebook;
  if (
    !('practiceId' in metadata['JupyterClass']) ||
    !('studentId' in metadata['JupyterClass'])
  ) {
    throw Error(`Invalid JupyterClass config. 'practiceId' and 'studentId' keys expected.`);
  }

  const invalidCells = [];
  for (const cell of notebook.cells) {
    if (
      cell['cell_type'] === 'code' &&
      'Question' in cell['metadata']
    ) {
      const questionCell = cell['metadata']['Question'];
      if (!('expected' in questionCell)) {
        invalidCells.push(questionCell);
      }
    }
  }

  if (invalidCells.length > 0) {
    throw Error(`
      Invalid cells: ${JSON.stringify(invalidCells)}
    `);
  }
}
