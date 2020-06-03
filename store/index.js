export const state = () => ({
  NotebookStore: {},
  QuestionStore: {},
  StudentStore: {},

  selectedNotebook: null,
  questions: {},
});

export const mutations = {
  syncStore(state, { NotebookStore, QuestionStore, StudentStore }) {
    state.NotebookStore = NotebookStore;
    state.QuestionStore = QuestionStore;
    state.StudentStore = StudentStore;
  },

  setSelectedNotebook(state, notebook) {
    state.selectedNotebook = notebook;
    state.questions = {...state.QuestionStore[notebook.id]};
  },

  setQuestionIsLive(state, { question, startTime }) {
    state.questions = {
      ...state.questions,
      [question.id]: {
        ...question,
        startTime,
        isLive: true,
      }
    }
  },

  setQuestionIsNotLive(state, { question, endTime }) {
    state.questions = {
      ...state.questions,
      [question.id]: {
        ...question,
        endTime,
        isLive: false,
      }
    }
  }
};
