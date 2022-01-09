const mongoose = require('mongoose');
const http = require('http');
const socketio = require('socket.io');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const { userService, chatroomService } = require('./services');

const server = http.createServer(app);

const usersLogin = [];

const usersLoginPush = (newUser) => {
  const findIndex = usersLogin.findIndex((user) => user.userId === newUser.userId);
  if (findIndex === -1) {
    usersLogin.push(newUser);
  }
};

const usersLoginRemove = (removeUser) => {
  const findIndex = usersLogin.findIndex((user) => user.userId === removeUser.userId);
  if (findIndex !== -1) {
    usersLogin.splice(findIndex, 1);
  }
};

const io = socketio(server, {
  cors: {
    origin: ['http://localhost:3006'],
  },
});

io.on('connect', (socket) => {
  socket.on('login', (userId) => {
    usersLoginPush({ userId, socketId: socket.id });
    socket.broadcast.emit('login', userId);
    // TODO get all chatroomsId of this userId -> socket.join(room)
  });

  socket.on('logout', (userId) => {
    userService.updateUserById(userId, { status: false });
    usersLoginRemove({ userId, socketId: socket.id });
    socket.broadcast.emit('logout', userId);
    // TODO get all chatroomsId of this userId -> socket.leave(room)
  });
});

mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  // server = app.listen(config.port, () => {
  server.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
