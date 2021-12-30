const httpStatus = require('http-status');
const { Chatroom, User, UserDetail } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * get chatroom by id
 * @param {String} chatroomId
 * @return {Promise<Chatroom>}
 */
const getChatRoomById = async (chatroomId) => {
  return Chatroom.findById(chatroomId)
    .populate({ path: 'membersPopulate', select: 'id name avatar status' })
    .populate({ path: 'outGroupMembersPopulate', select: 'id name avatar status' })
    .populate({ path: 'lastMessagePopulate', select: 'text sender type time' });
};

/**
 * create a chatroom
 * @param {Object} chatroomBody
 * @returns {Promise<Chatroom>}
 */
const createChatroom = async (chatroomBody) => {
  if (!chatroomBody.isGroupChat) {
    const chatroom = await Chatroom.isPeerToPeerExist(chatroomBody.members);
    if (chatroom) {
      return { id: chatroom.id, isExist: true };
    }
  }
  const uniqueMembers = new Set(chatroomBody.members);
  Object.assign(chatroomBody, { members: [...uniqueMembers] });

  if (!chatroomBody.time) {
    Object.assign(chatroomBody, { time: Date.now() });
  }
  let chatroom = await Chatroom.create(chatroomBody);
  chatroom = await chatroom
    .populate({ path: 'membersPopulate', select: 'id name avatar status' })
    .populate({ path: 'outGroupMembersPopulate', select: 'id name avatar status' })
    .populate({ path: 'lastMessagePopulate', select: 'text sender type time' })
    .execPopulate();

  return chatroom;
};

/**
 * query for chatrooms
 * @param {Object} filter
 * @param {Object} options
 * @param {string} [options.sortBy]
 * @param {number} [options.limit]
 * @param {number} [options.page]
 * @returns {Promise<QueryResult}
 */
const queryChatrooms = async (userId, search, filter, options) => {
  Object.assign(options, { populate: 'membersPopulate, lastMessagePopulate' });
  const conditions = [{ members: userId }];

  if (search) {
    const thisUser = await UserDetail.findById(userId);
    if (!thisUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User invalid');
    }

    const contacts = thisUser.contacts || [];
    const usersMeetCondition = await User.find({ $text: { $search: `"${search}"` }, _id: { $in: contacts } });

    const userIds = [];
    usersMeetCondition.forEach((user) => {
      userIds.push(user.id);
    });

    const orConditions = [{ $text: { $search: `"${search}"` } }, { members: { $in: userIds } }];
    conditions.push({ $or: orConditions });
  }

  // auto sort by time if sortBy == null
  if (!options.sortBy) {
    Object.assign(options, { sortBy: 'time:desc' });
  }

  Object.assign(filter, { $and: conditions });

  const chatrooms = await Chatroom.paginate(filter, options);
  return chatrooms;
};

/**
 * update chat room name
 * @param {String} newName
 * @param {String} chatroomId
 * @returns {Promise<Chatroom>}
 */
const updateChatroomName = async (newName, chatroomId) => {
  const chatroom = await Chatroom.findById(chatroomId);
  if (!chatroom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Chatroom not found');
  }
  Object.assign(chatroom, { name: newName });
  await chatroom.save();
  return chatroom;
};

/**
 * add member to chat room
 * @param {String} userId
 * @param {String} chatroomId
 * @returns {Promise<Chatroom>}
 */
const addMemberToChatroom = async (userId, chatroomId) => {
  const chatroom = await Chatroom.findById(chatroomId);
  if (!chatroom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Chatroom not found');
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
  }
  if (!chatroom.members.includes(userId)) {
    chatroom.members.push(userId);
  }
  if (chatroom.outGroupMembers.includes(userId)) {
    const newOutGroupMembers = chatroom.outGroupMembers.filter((memberId) => memberId !== userId);
    Object.assign(chatroom, { outGroupMembers: newOutGroupMembers });
  }

  await chatroom.save();
  return chatroom;
};

/**
 * delete member out of chat room
 * @param {String} userId
 * @param {String} chatroomId
 * @returns {Promise<Chatroom>}
 */
const deleteMemberOutOfChatroom = async (userId, chatroomId) => {
  const chatroom = await Chatroom.findById(chatroomId);
  if (!chatroom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Chatroom not found');
  }

  if (!chatroom.outGroupMembers.includes(userId)) {
    chatroom.outGroupMembers.push(userId);
  }

  const newMembers = chatroom.members.filter((memberId) => memberId !== userId);
  Object.assign(chatroom, { members: newMembers });

  await chatroom.save();
  return chatroom;
};

/**
 * update seen history
 * @param {String} chatroomId
 * @param {Object} userIdMessageId
 * @returns {Promise<Chatroom>}
 */
const updateSeenHistory = async (userIdMessageId, chatroomId) => {
  const chatroom = await Chatroom.findById(chatroomId);
  if (!chatroom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Chatroom not found');
  }
  Object.assign(chatroom.updateSeenHistory, userIdMessageId);
  await chatroom.save();
  return chatroom;
};

/**
 * update lastMessage
 * @param {String} chatroomId
 * @param {String} messageId
 * @returns {Promise<Chatroom>}
 */
const updateLastMessage = async (messageId, chatroomId) => {
  const chatroom = await Chatroom.findById(chatroomId);
  if (!chatroom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Chatroom not found');
  }
  Object.assign(chatroom, { lastMessage: messageId });
  await chatroom.save();
  return chatroom;
};

/**
 * check if user is in chatroom
 * @param {String} userId
 * @param {String} chatroomId
 * @returns {Promise<Chatroom>}
 */

const checkIsUserInChatroom = async (chatroomId, userId) => {
  const chatroom = await Chatroom.findOne({ _id: chatroomId, members: userId });
  if (!chatroom) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Sender not in this chatroom');
  }
  return chatroom;
};

module.exports = {
  getChatRoomById,
  createChatroom,
  queryChatrooms,
  updateChatroomName,
  addMemberToChatroom,
  deleteMemberOutOfChatroom,
  updateSeenHistory,
  updateLastMessage,
  checkIsUserInChatroom,
};
