import socket from "../plugins/socket.io";

export default (store) => {
  // Register events
  socket.on('store-update', data => {
    const selectedNotebook = store.state.selectedNotebook;
    if (selectedNotebook && !data.QuestionStore[selectedNotebook.id]) {
      store.commit('setSelectedNotebook', null);
      store.commit('setSelectedQuestions', []);
    }
    store.commit('syncStore', data);
  });
  socket.on('students-update', data => {
    store.commit('syncStudents', data);
  });
  socket.on('questions-update', data => {
    store.commit('syncQuestions', data);
  })
}
