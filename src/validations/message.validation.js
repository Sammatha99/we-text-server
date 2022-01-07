const Joi = require('joi');

const createMessage = {
  body: Joi.object().keys({
    type: Joi.string().required().valid('notify', 'text', 'image', 'video', 'file', 'record'),
    text: Joi.string().required(),
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
