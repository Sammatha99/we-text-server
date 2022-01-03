const { Message } = require('../models');

/**
 * create a message
 * @param {Object} messageBody
 * @returns {Promise<Message>}
 */
const createMessage = async (messageBody) => {
  if (!messageBody.time) {
    Object.assign(messageBody, { time: Date.now() });
  }
  return Message.create(messageBody);
};

/**
 * get chatroom's share files by chatroomId, sort by time
 * @param {*} chatroomId
 * @param {Object} filter
 * @param {Object} options
 * @param {string} [options.sortBy]
 * @param {number} [options.limit]
 * @param {number} [options.page]
 * @returns {Promise<QueryResult}
 * @returns
 */
const getShareFiles = async (chatroomId, filter, options) => {
  Object.assign(options, { sortBy: 'time:desc', select: 'id text type' });
  Object.assign(filter, { $and: [{ chatroomId }, { type: { $in: ['image', 'video'] } }] });
  const messages = await Message.paginate(filter, options);
  return messages;
};

/**
 * Query for messages
 * @param {string} chatroomId
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getMessages = async (chatroomId, filter, options) => {
  Object.assign(filter, { $and: [{ chatroomId }] });
  Object.assign(options, { sortBy: 'time:asc' });

  const messages = await Message.paginate(filter, options);
  return messages;
};

module.exports = {
  createMessage,
  getMessages,
  getShareFiles,
};
