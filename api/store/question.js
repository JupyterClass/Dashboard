// This is the in-memory mock db that makes provisioning an actual db unnecessary.
// An alternative is sqlite,

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

export function deleteNotebook(notebookId) {
  // Any potential memory leaks here? I'm assuming the garbage collector
  // will do its thang.. :3

  delete NotebookStore[notebookId];
  // Cascade and related questions
  delete QuestionStore[notebookId];
}

export function saveNotebookQuestions(notebook) {
  for (const cell of notebook.data.cells) {
    if (
      cell['cell_type'] === 'code' &&
      'Question' in cell['metadata']
    ) {
      const questionCell = cell['metadata']['Question'];
      questionCell.id = questionCell.id.toString();
      if (!(notebook.id in QuestionStore)) {
        QuestionStore[notebook.id] = {};
      }
      QuestionStore[notebook.id][questionCell.id] = {
        practiceId: notebook.id,
        ...questionCell
      }
    }
  }
}

export function getNotebook(id) {
  return NotebookStore[id];
}

export function getAllNotebooks() {
  return Object.values(NotebookStore);
}

export function saveQuestion(practiceId, question) {
  QuestionStore[practiceId][question.id] = question;
}

export function getQuestion(practiceId, questionId) {
  const practice = QuestionStore[practiceId];
  return practice ? practice[questionId] : null;
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

export function setQuestionStatusIsLive(practiceId, questionId, isLive, timestamp) {
  const question = QuestionStore[practiceId][questionId];
  question['isLive'] = isLive;
  question['startTime'] = timestamp;
}
