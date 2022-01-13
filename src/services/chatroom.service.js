const httpStatus = require('http-status');
const { Chatroom, User, UserDetail } = require('../models');
const { createMessage } = require('./message.service');
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
    .populate({ path: 'membersPopulate', select: 'id name avatar email status' })
    .populate({ path: 'outGroupMembersPopulate', select: 'id name avatar email status' })
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
  Object.assign(options, { populate: 'membersPopulate, outGroupMembersPopulate, lastMessagePopulate' });
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
 * @param {String} userId
 * @param {String} chatroomId
 * @returns {Promise<Chatroom>}
 */
const updateChatroomName = async (userId, newName, chatroomId) => {
  const chatroom = await Chatroom.findById(chatroomId);
  if (!chatroom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Chatroom not found');
  }

  const newMessage = {
    text: newName !== '' ? `named the group ${newName}` : 'removed the group name',
    type: 'notify',
    sender: userId,
    chatroomId,
    time: Date.now(),
  };
  const res = await createMessage(newMessage);

  Object.assign(chatroom, { name: newName, time: Date.now(), lastMessage: res.id });

  await chatroom.save();
  return chatroom
    .populate({ path: 'membersPopulate', select: 'id name avatar status email' })
    .populate({ path: 'outGroupMembersPopulate', select: 'id name avatar status email' })
    .populate({ path: 'lastMessagePopulate' })
    .execPopulate();
};

/**
 * add member to chat room
 * @param {Array} usersId
 * @param {String} chatroomId
 * @returns {Promise<Chatroom>}
 */
const addMembersToChatroom = async (usersId, chatroomId) => {
  const chatroom = await Chatroom.findById(chatroomId);
  if (!chatroom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Chatroom not found');
  }

  await Promise.all(
    usersId.map(async (userId) => {
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
      }
      const newMessage = {
        text: 'joined group',
        type: 'notify',
        sender: userId,
        chatroomId,
        time: Date.now(),
      };
      createMessage(newMessage);
      if (!chatroom.members.includes(userId)) {
        chatroom.members.push(userId);
      }
      if (chatroom.outGroupMembers.includes(userId)) {
        const newOutGroupMembers = chatroom.outGroupMembers.filter((memberId) => memberId !== userId);
        Object.assign(chatroom, { outGroupMembers: newOutGroupMembers });
      }
    })
  );

  Object.assign(chatroom, { time: Date.now() });

  await chatroom.save();
  return chatroom
    .populate({ path: 'membersPopulate', select: 'id name avatar status email' })
    .populate({ path: 'outGroupMembersPopulate', select: 'id name avatar status email' })
    .execPopulate();
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
  const newMessage = {
    text: 'left group',
    type: 'notify',
    sender: userId,
    chatroomId,
    time: Date.now(),
  };

  const res = await createMessage(newMessage);

  Object.assign(chatroom, { members: newMembers, lastMessage: res.id });

  await chatroom.save();
  return chatroom.populate({ path: 'lastMessagePopulate' }).execPopulate();
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
  chatroom.seenHistory = { ...chatroom.seenHistory, ...userIdMessageId };
  await chatroom.save();
  return chatroom;
};

/**
 * update lastMessage
 * @param {String} chatroomId
 * @param {String} messageId
 * @returns {Promise<Chatroom>}
 */
const updateLastMessage = async (messageId, time, chatroomId) => {
  const chatroom = await Chatroom.findById(chatroomId);
  if (!chatroom) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Chatroom not found');
  }
  Object.assign(chatroom, { lastMessage: messageId, time });
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

/**
 * get all chatroomsId by userId
 * @param {String} userId
 * @returns {Promise<Array>}
 */
const getAllChatroomsIdByUserId = async (userId) => {
  const chatroomsId = await Chatroom.find({ members: userId }).distinct('_id');
  return chatroomsId;
};

module.exports = {
  getChatRoomById,
  createChatroom,
  queryChatrooms,
  updateChatroomName,
  addMembersToChatroom,
  deleteMemberOutOfChatroom,
  updateSeenHistory,
  updateLastMessage,
  checkIsUserInChatroom,
  getAllChatroomsIdByUserId,
};
