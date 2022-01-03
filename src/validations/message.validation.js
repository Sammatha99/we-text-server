const Joi = require('joi');

const createMessage = {
  body: Joi.object().keys({
    text: Joi.string().required(),
    type: Joi.string().required().valid('notify', 'text', 'image', 'video', 'file', 'record'),
    sender: Joi.string().required(),
    time: Joi.number(),
    chatroomId: Joi.string().required(),
  }),
};

const getMessages = {
  query: Joi.object().keys({
    chatroomId: Joi.string().required(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = { createMessage, getMessages };
