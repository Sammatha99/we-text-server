const mongoose = require('mongoose');
const http = require('http');
const socketio = require('socket.io');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: ['http://localhost:3006'],
  },
});

io.on('connect', (socket) => {
  // eslint-disable-next-line no-console
  console.log('somebody connected !!!!');
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
