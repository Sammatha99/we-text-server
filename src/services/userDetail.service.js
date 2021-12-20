const httpStatus = require('http-status');
const { UserDetail, User } = require('../models');
const userService = require('./user.service');
const ApiError = require('../utils/ApiError');

/**
 * get userDetail
 * @param {String} id
 * @returns {Promise<UserDetail>}
 */
const getUserDetail = async (id) => {
  return UserDetail.findById(id);
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<UserDetail>}
 */
const getUserDetailById = async (id) => {
  return UserDetail.findById(id).populate({
    path: 'playlistPopulate',
    populate: {
      path: 'songsPopulate',
    },
  });
  // .populate({ path: 'followersPopulate', select: 'id name avatar status' })
  // .populate({ path: 'followingsPopulate', select: 'id name avatar status' })
  // .populate({ path: 'contactsPopulate', select: 'id name avatar status' });
};

/**
 * get followers of user by id
 * @param {ObjectId} id
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<User>}
 */
const getFollowersOfUserById = async (id, filter, options) => {
  const usersMeetCondition = {};
  if (id) {
    const thisUser = await UserDetail.findById(id);
    if (!thisUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User invalid');
    }
    const followers = thisUser.followers || [];
    Object.assign(usersMeetCondition, { _id: { $in: followers } });
  }
  Object.assign(filter, usersMeetCondition);

  const users = await User.paginate(filter, options);
  return users;
};

/**
 * get followings of user by id
 * @param {ObjectId} id
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<User>}
 */
const getFollowingsOfUserById = async (id, filter, options) => {
  const usersMeetCondition = {};
  if (id) {
    const thisUser = await UserDetail.findById(id);
    if (!thisUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User invalid');
    }
    const followings = thisUser.followings || [];
    Object.assign(usersMeetCondition, { _id: { $in: followings } });
  }
  Object.assign(filter, usersMeetCondition);

  const users = await User.paginate(filter, options);
  return users;
};

/**
 * get contacts of user by id
 * @param {ObjectId} id
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<User>}
 */
const getContactsOfUserById = async (id, filter, options) => {
  const usersMeetCondition = {};
  if (id) {
    const thisUser = await UserDetail.findById(id);
    if (!thisUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User invalid');
    }
    const contacts = thisUser.contacts || [];
    Object.assign(usersMeetCondition, { _id: { $in: contacts } });
  }
  Object.assign(filter, usersMeetCondition);

  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Create a userDetail
 * @param {String} userId
 * @param {Object} userDetailBody
 * @returns {Promise<UserDetail>}
 */
const createUserDetail = async (userId, userDetailBody) => {
  return UserDetail.create({ _id: userId, ...userDetailBody });
};

/**
 * Update UserDetail by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<UserDetail>}
 */
const updateUserDetailById = async (userId, updateBody) => {
  const userDetail = await UserDetail.findById(userId);
  if (!userDetail) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User Detail not found');
  }
  Object.assign(userDetail, updateBody);
  await userDetail.save();
  return userDetail;
};

/**
 * delete a user in followers
 * @param {String} userId
 * @param {String} followerId
 * @returns {Promist<UserDetail>}
 */
const deleteUserOutOfFollowers = async (userId, followerId) => {
  const userDetail = await getUserDetail(userId);
  if (!userDetail) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
  }
  const newFollowers = userDetail.followers.filter((item) => item !== followerId);
  Object.assign(userDetail, { followers: newFollowers });
  await userDetail.save();
  return userDetail;
};

/**
 * add a user in followers
 * @param {String} userId
 * @param {String} followerId
 * @returns {Promist<UserDetail>}
 */
const addUserToFollowers = async (userId, followerId) => {
  if (userId === followerId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot add yourself');
  }
  const userDetail = await getUserDetail(userId);
  if (!userDetail) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const follower = await userService.getUserById(followerId);
  if (!follower) {
    throw new ApiError(httpStatus.NOT_FOUND, 'follower not found');
  }
  if (!userDetail.followers.includes(followerId)) {
    userDetail.followers.push(followerId);
    await userDetail.save();
  }
  return userDetail;
};

/**
 * delete a user in followings
 * @param {String} userId
 * @param {String} followingId
 * @returns {Promist<UserDetail>}
 */
const deleteUserOutOfFollowings = async (userId, followingId) => {
  const userDetail = await getUserDetail(userId);
  if (!userDetail) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
  }
  const newFollowings = userDetail.followings.filter((item) => item !== followingId);
  Object.assign(userDetail, { followings: newFollowings });
  await userDetail.save();
  return userDetail;
};

/**
 * add a user in followings
 * @param {String} userId
 * @param {String} followingId
 * @returns {Promist<UserDetail>}
 */
const addUserToFollowings = async (userId, followingId) => {
  if (userId === followingId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot add yourself');
  }
  const userDetail = await getUserDetail(userId);
  if (!userDetail) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const following = await userService.getUserById(followingId);
  if (!following) {
    throw new ApiError(httpStatus.NOT_FOUND, 'following not found');
  }
  if (!userDetail.followings.includes(followingId)) {
    userDetail.followings.push(followingId);
    await userDetail.save();
  }
  return userDetail;
};

/**
 * delete a user in contacts
 * @param {String} userId
 * @param {String} contactId
 * @returns {Promist<UserDetail>}
 */
const deleteUserOutOfContacts = async (userId, contactId) => {
  const userDetail = await getUserDetail(userId);
  if (!userDetail) {
    throw new ApiError(httpStatus.NOT_FOUND, 'user not found');
  }
  const newContacts = userDetail.contacts.filter((item) => item !== contactId);
  Object.assign(userDetail, { contacts: newContacts });
  await userDetail.save();
  return userDetail;
};

/**
 * add a user in contacts
 * @param {String} userId
 * @param {String} contactId
 * @returns {Promist<UserDetail>}
 */
const addUserToContacts = async (userId, contactId) => {
  if (userId === contactId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot add yourself');
  }
  const userDetail = await getUserDetail(userId);
  if (!userDetail) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const contact = await userService.getUserById(contactId);
  if (!contact) {
    throw new ApiError(httpStatus.NOT_FOUND, 'contact not found');
  }
  if (!userDetail.contacts.includes(contactId)) {
    userDetail.contacts.push(contactId);
    await userDetail.save();
  }
  return userDetail;
};

module.exports = {
  getUserDetail,
  getUserDetailById,
  createUserDetail,
  updateUserDetailById,
  deleteUserOutOfFollowers,
  addUserToFollowers,
  deleteUserOutOfFollowings,
  addUserToFollowings,
  deleteUserOutOfContacts,
  addUserToContacts,
  getFollowersOfUserById,
  getFollowingsOfUserById,
  getContactsOfUserById,
};
