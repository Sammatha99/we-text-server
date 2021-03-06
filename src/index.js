const mongoose = require('mongoose');
// const http = require('http');
const socketio = require('socket.io');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const { userService, chatroomService } = require('./services');

let server;
let io;
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

const PORT = process.env.PORT || 3030;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  server = app.listen(PORT, () => {
    logger.info(`Listening to port ${PORT}`);
  });
  io = socketio(server, {
    cors: {
      origin: 'https://we-text-client.vercel.app/',
    },
  });
  io.on('connect', (socket) => {
    socket.on('login', async (userId) => {
      usersLoginPush({ userId, socketId: socket.id });
      socket.broadcast.emit('login', userId);
      const chatroomsId = await chatroomService.getAllChatroomsIdByUserId(userId);
      const chatroomsIdString = Array.from(chatroomsId, (id) => id.toString());
      socket.join(chatroomsIdString);
    });

    socket.on('logout', async (userId) => {
      userService.updateUserById(userId, { status: false });
      usersLoginRemove({ userId, socketId: socket.id });
      socket.broadcast.emit('logout', userId);
      const { rooms } = socket;
      rooms.forEach((room) => socket.leave(room));
    });

    socket.on('create-chatroom', (senderId, chatroomId, membersId) => {
      usersLogin.forEach((user) => {
        if (membersId.includes(user.userId)) {
          io.to(user.socketId).emit('new-chatroom', senderId, chatroomId);
        }
      });
    });

    socket.on('join-room', (chatroomId) => {
      socket.join(chatroomId);
    });

    socket.on('send-message', (message, sender) => {
      socket.broadcast.to(message.chatroomId).emit('receive-message', message, sender);
      socket.broadcast.to(message.chatroomId).emit(`receive-message-${message.chatroomId}`, message, sender);
    });

    socket.on('send-add-member', (chatroomId, lastMessageId, time, newMembersId) => {
      // g???i cho Global
      io.to(chatroomId).emit('receive-add-member', chatroomId);

      // g???i cho chat body
      io.to(chatroomId).emit(`receive-add-member-${chatroomId}`, chatroomId, lastMessageId, time, newMembersId);

      // m???i c??c th??nh vi??n m???i v??o
      usersLogin.forEach((user) => {
        if (newMembersId.includes(user.userId)) {
          io.to(user.socketId).emit('new-chatroom', '', chatroomId);
        }
      });
    });

    socket.on('send-remove-member', (message, sender) => {
      socket.broadcast.to(message.chatroomId).emit('receive-remove-member', message, sender);
      socket.broadcast.to(message.chatroomId).emit(`receive-message-${message.chatroomId}`, message, sender);
    });

    socket.on('send-chatroom-name', (newName, message, sender) => {
      socket.broadcast.to(message.chatroomId).emit('receive-chatroom-name', newName, message);
      io.to(message.chatroomId).emit(`receive-message-${message.chatroomId}`, message, sender);
    });

    socket.on('send-seen-message', (chatroomId, seenHistory) => {
      socket.to(chatroomId).emit('receive-seen-message', chatroomId, seenHistory);
    });
  });
  // server.listen(process.env.PORT || 3000, () => {
  //   logger.info(`Listening to port ${process.env.PORT || 3000}`);
  // });
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
