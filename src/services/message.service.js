const { Message } = require('../models');

/**
 * create a message
 * @param {Object} messageBody
 * @returns {Promise<Message>}
 */
const createMessage = async (messageBody) => {
  return Message.create(messageBody);
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
};
