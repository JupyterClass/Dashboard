import io from "socket.io-client";
import { firstEntry } from "../utils/object";

let socket = null;

/**
 * Since this plugin depends on the nuxt's 'auth' module,
 * it needs to be a plugin of the auth module
 * (placed in nuxt.config.auth.plugins rather than nuxt.config.plugins)
 */
export default function (context, inject) {
  const { app } = context;
  const { store } = app;

  setupSocket(context, inject);
  teardownSocket();

  // If the user isn't logged in, watch for auth change and setup socket
  if (store.state.auth && !store.state.auth.loggedIn) {
    console.log('Socket Plugin: Watching for auth change');
    store.watch(state => state.auth.loggedIn, (newValue, oldValue) => {
      console.log(`Socket Plugin: Auth changed -- ${oldValue} > ${newValue}`);
      if (newValue) {
        setupSocket(context, inject);
      } else {
        teardownSocket();
      }
    });
  }
}

function setupSocket(context, inject) {

  const { app } = context;
  const { store } = app;

  let token = app.$auth.getToken('customStrategy');
  if (token) {
    console.log('Token present. Setting up socket connection..');
    token = token.replace('bearer ', '');
    socket = io(`/?token=${token}`);

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
    });
  }

  // Because calling inject the second time won't replace the initially injected object
  inject('socket', {
    emit: (...args) => {
      if (socket) {
        socket.emit(...args);
      } else {
        console.error('Socket connection not established!');
      }
    },
    on: (...args) => {
      if (socket) {
        socket.on(...args);
      } else {
        console.error('Socket connection not established!');
      }
    },
  });
}

function teardownSocket() {

}
