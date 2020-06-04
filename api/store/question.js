// This is the in-memory mock db that makes provisioning an actual db unnecessary.
// An alternative is sqlite,
import { pushAllStateToClient } from "./sync";

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
  pushAllStateToClient();
}

export function getNotebook(id) {
  return NotebookStore[id];
}

export function getAllNotebooks() {
  return Object.values(NotebookStore);
}

export function saveQuestion(practiceId, question) {
  QuestionStore[practiceId][question.id] = question;
  pushAllStateToClient();
}

export function getQuestion(practiceId, questionId) {
  return QuestionStore[practiceId][questionId];
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
