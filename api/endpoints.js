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
import {
  duplicateStudentIdError,
  invalidEndpoint,
  invalidPayloadError,
  nonexistentPracticeError,
  nonexistentQuestionError
} from "./response/error";
import {
  joinedSessionSuccess
} from "./response/success";
import { getStudent, saveStudent, setStudentProgress, StudentStore } from "./store/student";

export default {

  '/join': async (req, res) => {
    let { studentId, practiceId, secret } = await getJson(req);

    if (getNotebook(practiceId)) {
      // the notebook exists, and the student id isn't already in use
      if (!getStudent(studentId)) {
        saveStudent(studentId);
        res.end(joinedSessionSuccess());
      } else {
        console.log(`Rejecting studentId: "${studentId}" -> already in use.`);
        res.end(duplicateStudentIdError());
      }
    } else {
      console.log(`Student "${studentId}" tried to join non-existent Practice "${practiceId}"`);
      res.end(nonexistentPracticeError());
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
        id: fileName.replace('.ipynb', ''),
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
      let { studentId, practiceId, questionId, output } = payload;
      questionId = questionId.toString();

      if (!getStudent(studentId)) {
        if (getNotebook(practiceId)) {
          // practice session exists
          saveStudent(studentId);
        }
      }

      const question = getQuestion(practiceId, questionId);

      if (!question) {
        res.end(nonexistentQuestionError());
        return;
      }

      const expectedOutput = question.expected;

      const evaluation = evaluate(output, expectedOutput);

      // TODO: Update student store with student's completeness
      setStudentProgress({
        studentId,
        practiceId,
        questionId,
        completeness: evaluation.result === 'OK' ? 100 : 0,
        updatedAt: Date.now(),
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
