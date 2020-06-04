export const state = () => ({
  NotebookStore: {},
  QuestionStore: {},
  StudentStore: {},

  selectedNotebook: null,
});

export const mutations = {
  syncStore(state, { NotebookStore, QuestionStore, StudentStore }) {
    state.NotebookStore = NotebookStore;
    state.QuestionStore = QuestionStore;
    state.StudentStore = StudentStore;
  },

  syncQuestions(state, { QuestionStore }) {
    state.QuestionStore = QuestionStore;
  },

  syncStudents(state, { StudentStore }) {
    state.StudentStore = StudentStore;
  },

  setSelectedNotebook(state, notebook) {
    state.selectedNotebook = notebook;
  },

  setQuestionIsLive(state, { question, startTime }) {
    state.QuestionStore = {
      ...state.QuestionStore,
      [state.selectedNotebook.id]: {
        ...(state.QuestionStore[state.selectedNotebook.id] || {}),
        [question.id]: {
          ...question,
          startTime,
          isLive: true,
        }
      }
    };
  },

  setQuestionIsNotLive(state, { question, endTime }) {
    state.QuestionStore = {
      ...state.QuestionStore,
      [state.selectedNotebook.id]: {
        ...(state.QuestionStore[state.selectedNotebook.id] || {}),
        [question.id]: {
          ...question,
          endTime,
          isLive: false,
        }
      }
    };
  }
};
