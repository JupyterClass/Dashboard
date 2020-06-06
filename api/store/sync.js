import { NotebookStore, QuestionStore } from "./question";
import { StudentStore } from "./student";
import { io } from "../websocket";

// Push data to client
export function pushAllStateToClient() {
  io.emit('store-update', {
    NotebookStore, QuestionStore, StudentStore
  });
}

export function pushNotebooksState() {
  io.emit('notebooks-update', {
    NotebookStore
  });
}

export function pushQuestionsState() {
  io.emit('questions-update', {
    QuestionStore
  });
}

export function pushStudentsState() {
  io.emit('students-update', {
    StudentStore
  });
}

export const eventHandlers = {
  'client-question-enable': data => {
    const { practiceId, id } = data;
    QuestionStore[practiceId][id] = data;
    pushQuestionsState();
  },

  'client-question-disable': () => {
    const { practiceId, id } = data;
    QuestionStore[practiceId][id] = data;
    pushQuestionsState();
  }
};
