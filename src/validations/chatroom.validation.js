const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getChatroom = {
  params: Joi.object().keys({
    chatroomId: Joi.string().custom(objectId),
  }),
};

const createChatroom = {
  body: Joi.object().keys({
    isGroupChat: Joi.boolean().required(),
    members: Joi.array().required(),
    outGroupMembers: Joi.array(),
    name: Joi.string(),
    seenHistory: Joi.object(),
    lastMessage: Joi.string(),
  }),
};

const getChatrooms = {
  query: Joi.object().keys({
    userId: Joi.string().required(),
    search: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updateChatroomName = {
  params: Joi.object().keys({
    chatroomId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.boolean().required(),
  }),
};

const updateChatroomMember = {
  params: Joi.object().keys({
    chatroomId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    userId: Joi.boolean().required(),
  }),
};

const updateChatroomSeenHistory = {
  params: Joi.object().keys({
    chatroomId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    userIdMessageId: Joi.object().required(),
  }),
};

module.exports = {
  getChatroom,
  createChatroom,
  getChatrooms,
  updateChatroomName,
  updateChatroomMember,
  updateChatroomSeenHistory,
};
