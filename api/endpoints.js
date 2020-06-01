import evaluate from "./evaluate";
import { getJson } from "./utils/json";
import { getFileUploadContents } from "./utils/fileUploads";
import { getAllQuestions, saveNotebook, saveNotebookQuestions } from "./store/question";
import { invalidEndpoint, invalidPayloadError } from "./errors";

export default {

  /**
   *
   */
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
      res.end("Correct: " + evaluate(output));
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
