import http from 'http';
import socketIO from 'socket.io';
import { eventHandlers } from "../store/sync";

// TODO: Is there a way to share the socket instance with other modules???
export let io;

export default function () {
  this.nuxt.hook('render:before', (renderer) => {
    const server = http.createServer(this.nuxt.renderer.app);
    io = socketIO(server);

    // overwrite nuxt.server.listen()
    this.nuxt.server.listen = (port, host) =>
      new Promise(resolve =>
        server.listen(port || 3000, host || 'localhost', resolve)
      );

    // close this server on 'close' event
    this.nuxt.hook('close', () => new Promise(server.close));

    // Add socket.io events
    io.on('connection', socket => {
      console.log('Connected');

      // Registering event handlers from sync.js
      for (const event in eventHandlers) {
        socket.on(event, eventHandlers[event]);
      }
    });
  })
}
