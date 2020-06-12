import url from "url";
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
  deleteNotebook,
} from "./store/question";
import {
  error,
  duplicateStudentIdError,
  invalidEndpoint,
  invalidPayloadError,
  nonexistentPracticeError,
  nonexistentQuestionError,
  unauthorizedError
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
import { createJwt } from "./auth";
import { pushAllStateToClient, pushStudentsState } from "./store/events";

const SECRET = process.env.SECRET;
console.log('🔐 JWT Secret:', SECRET);

export const unprotected = [
  // Not protected by auth module
  '/join', // -> students will get jwt from here
]

export default {

  '/join': async (req, res, user) => {
    let { studentId, practiceId, sessionPwd } = await getJson(req);

    const notebook = getNotebook(practiceId);

    if (notebook) {
      // the notebook exists, and the student id isn't already in use
      const { expiry, sessionPwd: pwd } = notebook;
      if (sessionPwd !== pwd) {
        console.log(`Rejecting join request from "${studentId}" -> provided password "${sessionPwd}" incorrect`);
        res.statusCode = 401;
        res.end(unauthorizedError());
        return;
      }

      if (!getStudent(studentId)) {

        saveStudent(studentId);
        pushStudentsState();
        const jwt = createJwt.student({
          id: studentId,
          exp: Math.floor(expiry / 1000),
        }, SECRET);
        console.log(`Created jwt for student ${studentId}`, jwt);
        res.end(joinedSessionSuccess(jwt));

      } else {
        console.log(`Rejecting studentId: "${studentId}" -> already in use.`);
        res.end(duplicateStudentIdError());
      }
    } else {
      console.log(`Student "${studentId}" tried to join non-existent Practice "${practiceId}"`);
      res.end(nonexistentPracticeError());
    }
  },

  '/rejoin': async (req, res, user) => {
    // User here is guaranteed to be valid by the auth module
    if (getStudent(user.id)) {
      res.end(joinedSessionSuccess());
    } else {
      saveStudent(user.id);
      pushStudentsState();
      res.end(joinedSessionSuccess());
    }
    console.log(`Student "${user.id}" rejoined class`);
  },

  '/sync-stores': async (req, res, user) => {
    // For the client to synchronise its store with the server's
    res.end(JSON.stringify({ NotebookStore, QuestionStore, StudentStore }));
  },

  '/upload': async (req, res, user) => {
    if (req.method.toLowerCase() !== 'post') {
      res.end(invalidEndpoint());
      return;
    }

    try {
      let { contents: notebook } = await getFileUploadContents(req, { ext: '.ipynb' });
      notebook = {
        data: JSON.parse(notebook)
      };

      try {
        verifyMetadata(notebook.data);
      } catch(err) {
        console.log(`/upload: Rejecting notebook - ${err}`);
        res.end(error(err.toString()));
        return;
      }
      notebook.id = notebook.data.metadata['JupyterClass']['practiceId'];

      const expiry = notebook.data.metadata['JupyterClass']['expiry'];
      if (expiry) {
        const expiryTimestamp = Number(new Date(expiry));
        const timeToDelete = expiryTimestamp - Date.now();
        notebook.expiry = expiryTimestamp;
        // setTimeout(() => {
        //   deleteNotebook(notebook.id);
        //   deletePracticeProgress(notebook.id);
        // }, timeToDelete)
        // console.log(`/upload: Notebook ${notebook.id} valid for ${timeToDelete} seconds`);
        // console.log(`/upload: Deletion of ${notebook.id} on ${expiry} (${expiryTimestamp}) queued`);
      }

      // For everyone's convenience, the notebook should contain the session password
      // so instructors don't have to share the password back and forth
      notebook.sessionPwd = notebook.data.metadata['JupyterClass']['sessionPwd'];

      saveNotebook(notebook);
      saveNotebookQuestions(notebook);
      pushAllStateToClient();

    } catch (err) {
      console.error('/upload: Unexpected error - ' + err);
      res.end(error(err.toString()))
      return;
    }
    res.end(uploadNotebookSuccess());
  },

  '/evaluate': async (req, res, user) => {

    let payload;
    try {
      payload = await getJson(req);
    } catch (err) {
      res.end(invalidPayloadError());
      return;
    }

    if (isValidEvalPayload(payload)) {
      let { practiceId, questionId, output } = payload;
      const studentId = user.id;
      questionId = questionId.toString();

      if (!getStudent(studentId)) {
        res.statusCode = 401;
        res.end(unauthorizedError());
        return;
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
      pushStudentsState();

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

  '/questions': async (req, res, user) => {
    res.end(JSON.stringify(getAllQuestions()));
  },

  '/practice/status': async (req, res) => {
    const { id } = url.parse(req.url, true).query;
    if (id && getNotebook(id)) {
      res.end(JSON.stringify({ status: 'live' }));
      return;
    }
    res.end(JSON.stringify({ status: 'down' }));
  },

  '/': async (req, res, user) => {
    res.end(JSON.stringify({ hello: 'world!' }));
  },
};
