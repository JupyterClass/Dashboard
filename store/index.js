import websocketSyncPlugin from "./websocketSyncPlugin";
export const plugins = [ websocketSyncPlugin ];

export const state = () => ({
  NotebookStore: {},
  QuestionStore: {},
  StudentStore: {},

  selectedNotebook: null,
  selectedQuestions: [],
});


export const mutations = {
  syncStore(state, { NotebookStore, QuestionStore, StudentStore }) {
    state.NotebookStore = NotebookStore || {};
    state.QuestionStore = QuestionStore || {};
    state.StudentStore = StudentStore || {};
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

  setSelectedQuestions(state, questionIds) {
    state.selectedQuestions = [...questionIds];
  },

  setSelectedQuestion(state, questionId) {
    if (state.selectedQuestions.indexOf(questionId) === -1) {
      state.selectedQuestions = [questionId, ...state.selectedQuestions];
    }
  },

  unsetSelectedQuestion(state, questionId) {
    state.selectedQuestions = state.selectedQuestions.filter(id => id !== questionId);
  },

  setQuestionColor(state, { question, color }) {
    state.QuestionStore = {
      ...state.QuestionStore,
      [state.selectedNotebook.id]: {
        ...(state.QuestionStore[state.selectedNotebook.id] || {}),
        [question.id]: {
          ...question,
          color
        }
      }
    };
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
  },
};
