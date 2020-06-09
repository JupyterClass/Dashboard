import evaluate from "./evaluate";
import { getJson } from "./utils/json";
import { getFileUploadContents } from "./utils/fileUploads";
import {
  NotebookStore,
  QuestionStore,
  getAllQuestions,
  saveNotebook,
  saveNotebookQuestions,
  getQuestion,
  getNotebook,
  deleteNotebook
} from "./store/question";
import {
  error,
  duplicateStudentIdError,
  invalidEndpoint,
  invalidPayloadError,
  nonexistentPracticeError,
  nonexistentQuestionError
} from "./response/error";
import {
  joinedSessionSuccess,
  uploadNotebookSuccess
} from "./response/success";
import {
  getStudent,
  saveStudent,
  setStudentProgress,
  StudentStore,
  deletePracticeProgress,
} from "./store/student";
import { isValidEvalPayload } from "./evaluate/validation";
import { verifyMetadata } from "./notebook/metadata";

export const unprotected = [
  // Not protected by auth module
  '/join', // -> students will get jwt from here
]

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
        console.log(`/upload: Rejecting notebook "${notebook.id}" - ${err}`);
        res.end(error(err.toString()));
        return;
      }

      saveNotebook(notebook);
      saveNotebookQuestions(notebook);

      const expiry = notebook.data.metadata['JupyterClass']['expiry'];
      if (expiry) {
        const timeToDelete = Number(new Date(expiry)) - Date.now();
        setTimeout(() => {
          deleteNotebook(notebook.id);
          deletePracticeProgress(notebook.id);
        }, timeToDelete)
        console.log(`/upload: Deletion of ${notebook.id} on ${new Date(timeToDelete)} queued`);
      }

    } catch (err) {
      console.error('/upload: Unexpected error - ' + err);
      res.end(error(err.toString()))
      return;
    }
    res.end(uploadNotebookSuccess());
  },

  '/evaluate': async (req, res) => {
    let payload;
    try {
      payload = await getJson(req);
    } catch (err) {
      res.end(invalidPayloadError());
      return;
    }

    if (isValidEvalPayload(payload)) {
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
