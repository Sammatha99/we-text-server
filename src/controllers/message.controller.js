const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { messageService, chatroomService } = require('../services');

const createMessage = catchAsync(async (req, res) => {
  await chatroomService.checkIsUserInChatroom(req.body.chatroomId, req.body.sender);
  const message = await messageService.createMessage(req.body);
  await chatroomService.updateLastMessage(message.id, req.body.chatroomId);
  res.status(httpStatus.CREATED).send(message);
});

const getMessages = catchAsync(async (req, res) => {
  const filter = {};
  const options = pick(req.query, ['limit', 'page']);
  const { chatroomId } = req.query;
  const result = await messageService.getMessages(chatroomId, filter, options);
  res.send(result);
});

module.exports = {
  createMessage,
  getMessages,
};
