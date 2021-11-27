const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const messageSchema = mongoose.Schema({
  text: {
    type: String,
    require: true,
  },
  sender: {
    type: String,
    require: true,
  },
  type: {
    type: String,
    require: true,
  },
  time: {
    type: Number,
    require: true,
  },
  chatroomId: {
    type: String,
    require: true,
  },
});

messageSchema.set('toObject', { virtuals: true });
messageSchema.set('toJSON', { virtuals: true });

// add plugin that converts mongoose to json
messageSchema.plugin(toJSON);
messageSchema.plugin(paginate);

/**
 * @typedef Message
 */
const Message = mongoose.model('messages', messageSchema, 'messages');

module.exports = Message;
