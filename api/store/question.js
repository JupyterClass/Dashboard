// This is the in-memory mock db that makes provisioning an actual db unnecessary.
// An alternative is sqlite,
import { io } from "../websocket";
console.log('>>>>>>>>>>>>>', io);

export const NotebookStore = {};
/**
 * @type {{
 *   id : string | number
 *   practiceId : string
 *   expected: string
 * }}
 */
export const QuestionStore = {};

export function saveNotebook(notebook) {
  NotebookStore[notebook.id] = notebook;
}

export function saveNotebookQuestions(notebook) {
  for (const cell of notebook.data.cells) {
    if (
      cell['cell_type'] === 'code' &&
      'Question' in cell['metadata']
    ) {
      const questionCell = cell['metadata']['Question'];
      if (!(notebook.id in QuestionStore)) {
        QuestionStore[notebook.id] = {};
      }
      QuestionStore[notebook.id][questionCell.id] = {
        practiceId: notebook.id,
        ...questionCell
      }
    }
  }
  pushToClient();
}

export function getNotebook(id) {
  return NotebookStore[id];
}

export function getAllNotebooks() {
  return Object.values(NotebookStore);
}

export function saveQuestion({
  id = '',
  data = {
    expectedOutput: ''
  },
}) {
  QuestionStore[id] = { id, data };
}

export function getQuestion(id) {
  return QuestionStore[id];
}

export function getAllQuestions() {
  const questions = [];
  for (const notebookQuestions of Object.values(QuestionStore)) {
    for (const question of Object.values(notebookQuestions)) {
      questions.push(question);
    }
  }
  return questions;
}

function pushToClient() {
  console.log('editted')
  io.emit('store-update', {
    NotebookStore, QuestionStore
  });
}
