import socket from "../plugins/socket.io";
import { firstEntry } from "../utils/object";

export default (store) => {
  // Register events
  socket.on('store-update', data => {
    const selectedNotebook = store.state.selectedNotebook;
    if (selectedNotebook && !data.QuestionStore[selectedNotebook.id]) {
      store.commit('setSelectedNotebook', null);
      store.commit('setSelectedQuestions', []);
    }

    store.commit('syncStore', data);

    if (
      !selectedNotebook &&
      data.NotebookStore &&
      Object.keys(data.NotebookStore).length > 0
    ) {
      // Set the default selected notebook as the first notebook
      const [_, notebook] = firstEntry(data.NotebookStore);
      store.commit('setSelectedNotebook', notebook);
      store.commit('setSelectedQuestions',
        Object.values(data.QuestionStore[notebook.id]).map(qn => qn.id)
      );
    }

  });

  socket.on('students-update', data => {
    store.commit('syncStudents', data);
  });

  socket.on('questions-update', data => {
    store.commit('syncQuestions', data);
  })
}
