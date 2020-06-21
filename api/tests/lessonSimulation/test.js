const yargs = require('yargs');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

let PRACTICE_ID = null; // For shutdown hook to tear down in case of early termination

const vlogger = {
  log(...args) {
    if (testConfigs.verbose) {
      console.log(...args);
    }
  },
}

const {
  serverUrl,
  serverSecret,
  notebookPath,
  numStudents,
  qnTimeNeeded,
  joinTimeNeeded,
  verbose
} = yargs
  .option('serverUrl', {
    type: 'string',
    describe: 'Url of the JupyterClass server',
    default: 'http://localhost:3000'
  })
  .option('serverSecret', {
    type: 'string',
    describe: 'Url of the JupyterClass server',
    default: 'jupyter123!'
  })
  .option('notebookPath', {
    type: 'string',
    describe: 'Path to the test notebook',
    default: path.join(__dirname, 'notebooks', 'Example Notebook A.ipynb')
  })
  .option('numStudents', {
    type: 'number',
    description: 'number of students in the class',
    default: 50,
  })
  .option('qnTimeNeeded', {
    type: 'array',
    description: '[min, max]: the minimum and maximum time in seconds for a student to finish a question',
    default: [10, 60],
  })
  .option('joinTimeNeeded', {
    type: 'array',
    description: '[min, max]: the minimum and maximum time in seconds for a student to join the session',
    default: [3, 10],
  })
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging',
    default: true,
  })
  .help()
  .argv

const testConfigs = {
  serverUrl,
  serverSecret,
  notebookPath,
  numStudents,
  qnTimeNeeded,
  joinTimeNeeded,
  verbose
}

let token;
console.log('Initialised with test configs:');
console.table(testConfigs);

async function main() {
  vlogger.log('TEST STARTING');
  await setup();
  let { metadata, questions } = readNotebook(testConfigs.notebookPath);
  const { practiceId, sessionPwd } = metadata;
  PRACTICE_ID = practiceId;

  questions = questions.map(({ id, expected }) => new Question(id, practiceId, expected));
  await startQuestions(questions);

  const Students = []
  for (let i = 1; i <= testConfigs.numStudents; i++) {
    Students.push(new Student('student-' + i, questions, { practiceId, sessionPwd }));
  }

  const studentTimeTakenMap = {};
  const promises = [];
  for (const student of Students) {
    studentTimeTakenMap[student.id] = {};
    promises.push(
      student.join()
        .then(async (response) => {
          if (response.status === 'success') {
            while (!student.isDone()) {
              const [result, { questionId, timeTaken }] = await student.doNextQuestion();
              vlogger.log(`
                Server finished evaluating student "${student.id}" for qn ${questionId} - result:
                \t${JSON.stringify(result)}
              `);
              if (result.evaluation.result === 'OK') {
                studentTimeTakenMap[student.id][questionId] = Math.floor(timeTaken);
              } else {
                console.error(result);
              }
            }
          } else {
            console.error('Student ' + student.id + ' failed to join session');
            throw Error('Student couldnt join session!!!');
          }
        })
        .then(() => {
          vlogger.log(student.id + ' completed');
        })
    );
  }
  await Promise.all(promises);
  await teardown(practiceId);
  console.log('TEST COMPLETED');
  console.table(studentTimeTakenMap);
}

async function setup() {
  token = await getToken(testConfigs.serverSecret);
  const uploadResult = await uploadNotebookToServer(testConfigs.notebookPath, token);

  if (uploadResult.status !== 'success') {
    throw Error('Failed to upload notebook to server');
  }

  vlogger.log('Uploaded notebook to server! response: ' + JSON.stringify(uploadResult));
}

async function teardown(practiceId) {
  // delete notebook
  await deleteNotebook(practiceId || PRACTICE_ID);
  await deleteStudents();
}

async function startQuestions(questions) {
  for (const question of questions) {
    const { practiceId, id } = question;
    const result = await apiGet(
      `/api/question/start?practiceId=${practiceId}&questionId=${id}&isLive=true`,
      { authorization: 'bearer ' + token }
    );
    vlogger.log('Qn activate result: ' + JSON.stringify(result));
    if (result.status === 'error') {
      throw Error(result.msg);
    }
  }
  vlogger.log('Activated questions: [' + questions.map(qn => qn.id) + ']');
}

function getToken(password) {
  return apiPost('/api/auth/login',
    {
      password
    })
    .then(response => response.token);
}

function uploadNotebookToServer(notebookPath, token) {
  vlogger.log('Uploading to')
  const formData = new FormData();
  formData.append('file', fs.createReadStream(notebookPath));
  return fetch(testConfigs.serverUrl + '/api/upload',
    {
      method: 'POST',
      headers: {
        "authorization": "bearer " + token
      },
      body: formData
    })
    .then(response => response.json());
}

function readNotebook(filePath) {
  const notebook = JSON.parse(fs.readFileSync(filePath).toString());
  const metadata = getMetadata(notebook);
  const questions = [];

  for (const cell of notebook.cells) {
    if (
      cell['cell_type'] === 'code' &&
      'Question' in cell['metadata']
    ) {
      const questionCell = cell['metadata']['Question'];
      questions.push(questionCell);
    }
  }
  return {
    metadata,
    questions
  }
}

function getMetadata(notebook) {
  return notebook['metadata']['JupyterClass'];
}

class Question {
  constructor(id, practiceId, expectedOutput) {
    this.id = id;
    this.practiceId = practiceId;
    this.expectedOutput = expectedOutput;
  }
}

// Simulate 40 students sending their outputs to the server
class Student {
  constructor(id, questionsToComplete, { practiceId, sessionPwd }) {
    this.id = id;
    this.questionsToComplete = [...questionsToComplete]; // queue
    this.practiceId = practiceId;
    this.sessionPwd = sessionPwd;
    this.token = null;
  }

  isDone() {
    return this.questionsToComplete.length === 0;
  }

  join() {
    // Students don't join ALL at the same time
    return new Promise((resolve, reject) => {
      const [lower, upper] = testConfigs.joinTimeNeeded;
      const joinSessionDelay = Math.floor(randBetween(lower, upper) * 1000);
      vlogger.log(`Student ${this.id} joining session in ${joinSessionDelay}s`);
      setTimeout(() => {
        apiPost('/api/join', {
          studentId: this.id,
          practiceId: this.practiceId,
          sessionPwd: this.sessionPwd,
        }).then(response => {
          if (response.status === 'success') {
            vlogger.log('Joined session successfully!', response);
            this.token = response.token;
            resolve(response);
          } else {
            console.error('Failed to join session: ' + JSON.stringify(response));
            resolve(response);
          }
        })
      }, joinSessionDelay);
    })
  }

  doNextQuestion() {
    return new Promise((resolve, reject) => {
      const question = this.questionsToComplete.shift();
      vlogger.log(this.id + ' attempting ' + question.id);

      const [lowerTimeLimit, upperTimeLimit] = testConfigs.qnTimeNeeded;
      const timeTakenToCompleteQuestion = randBetween(lowerTimeLimit, upperTimeLimit);
      setTimeout(() => {
        vlogger.log(this.id + ' completed ' + question.id);
        this.sendOutputToServer(question.id, question.expectedOutput)
          .then(response => resolve(
            [
              response,
              {
                questionId: question.id,
                timeTaken: timeTakenToCompleteQuestion,
              }
            ]
          ))
          .catch(err => reject(err));
      }, timeTakenToCompleteQuestion * 1000);
    });
  }

  sendOutputToServer(questionId, output) {
    return apiPost('/api/evaluate', {
      practiceId: this.practiceId,
      questionId,
      output
    }, {
      authorization: 'bearer ' + this.token,
    })
  }
}

function randBetween(fromInclusive, toInclusive) {
  return fromInclusive + (Math.random() * (toInclusive - fromInclusive));
}

async function deleteNotebook(id) {
  return apiDelete('/api/practice?id=' + id);
}

async function deleteStudents() {
  await apiDelete('/api/students');
}

function apiGet(endpoint, headers) {
  return fetch(testConfigs.serverUrl + endpoint, { headers }).then(response => response.json());
}

function apiPost(endpoint, payload = {}, headers = {}) {
  return fetch(testConfigs.serverUrl + endpoint, {
    method: "POST",
    headers: {
      'content-type': 'application/json',
      ...headers
    },
    body: JSON.stringify(payload)
  }).then(
    response => response.json()
  );
}

function apiDelete(endpoint) {
  return fetch(testConfigs.serverUrl + endpoint,
    {
      method: 'DELETE',
      headers: {
        "authorization": "bearer " + token
      },
    })
    .then(response => response.json());
}

process.on('SIGINT', async () => {
  vlogger.log('Performing teardown');
  await teardown();
  vlogger.log('Done');
  process.exit(1);
});

main();
