import http from 'http';
import socketIO from 'socket.io';
import { eventHandlers } from "../store/events";
import { decodeJwt } from "../auth";

const SECRET = process.env.SECRET;

// TODO: Is there a way to share the socket instance with other modules???
export let io;

export default function () {
  this.nuxt.hook('render:before', (renderer) => {
    const server = http.createServer(this.nuxt.renderer.app);
    io = socketIO(server);

    // overwrite nuxt.server.listen()
    this.nuxt.server.listen = (port, host) => {
      port = process.env.PORT || port || 3000;
      host = process.env.HOST || host || 'localhost';
      console.log(`Listening on ${host}:${port}`);
      return new Promise(resolve =>
        server.listen(port, host, resolve)
      );
    }

    // close this server on 'close' event
    this.nuxt.hook('close', () => new Promise(server.close));

    io.use(function(socket, next) {
      let token = socket.handshake.query.token;
      console.log('websocket handshake token:', token);
      if (token) {
        console.log('!');
        try {
          const jwt = decodeJwt(token, SECRET);
          console.log(jwt);
          if (jwt.role === 'tm') {
            next();
          } else {
            next(new Error('Unauthorized user'));
          }
        } catch (err) {
          next(err);
        }
      } else {
        next(new Error('Unauthorized: Invalid token provided'));
      }
    });

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
