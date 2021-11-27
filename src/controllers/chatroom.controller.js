const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { chatroomService } = require('../services');

const getChatRoomById = catchAsync(async (req, res) => {
  const chatroom = await chatroomService.getChatRoomById(req.params.chatroomId);
  res.send(chatroom);
});

const createChatroom = catchAsync(async (req, res) => {
  const chatroom = await chatroomService.createChatroom(req.body);
  res.status(httpStatus.CREATED).send(chatroom);
});

const getChatrooms = catchAsync(async (req, res) => {
  const filter = {};
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const { search, userId } = req.query;
  const result = await chatroomService.queryChatrooms(userId, search, filter, options);
  res.send(result);
});

const updateChatroomName = catchAsync(async (req, res) => {
  const chatroom = await chatroomService.updateChatroomName(req.body.name, req.params.chatroomId);
  res.send(chatroom);
});

const addMemberToChatroom = catchAsync(async (req, res) => {
  const chatroom = await chatroomService.addMemberToChatroom(req.body.userId, req.params.chatroomId);
  res.send(chatroom);
});

const deleteMemberOutOfChatroom = catchAsync(async (req, res) => {
  const chatroom = await chatroomService.deleteMemberOutOfChatroom(req.body.userId, req.params.chatroomId);
  res.send(chatroom);
});

const updateSeenHistory = catchAsync(async (req, res) => {
  const chatroom = await chatroomService.updateSeenHistory(req.body.userIdMessageId, req.params.chatroomId);
  res.send(chatroom);
});

module.exports = {
  getChatRoomById,
  createChatroom,
  getChatrooms,
  updateChatroomName,
  addMemberToChatroom,
  deleteMemberOutOfChatroom,
  updateSeenHistory,
};
