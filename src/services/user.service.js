const httpStatus = require('http-status');
const { User, UserDetail } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {string} userId
 * @param {string} search
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (userId, search, filter, options) => {
  const usersMeetCondition = {};
  if (userId) {
    const thisUser = await UserDetail.findById(userId);
    if (!thisUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User invalid');
    }
    const contacts = thisUser.contacts || [];
    Object.assign(usersMeetCondition, { _id: { $in: contacts } });
  }
  if (search) {
    Object.assign(usersMeetCondition, { $text: { $search: `"${search}"` } });
  }
  Object.assign(filter, usersMeetCondition);

  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await user.remove();
  return user;
};

/**
 * Generate new password
 * @param {String} email
 * @returns {Promise<string>}
 */
const generateNewPassword = async (email) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const digits = '0123456789';
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let newPassword = '';
  for (let i = 0; i < 8; i += 1) {
    if (i % 2 === 0) newPassword += digits[Math.floor(Math.random() * 10)];
    else newPassword += characters[Math.floor(Math.random() * 26)];
  }
  await updateUserById(user.id, { password: newPassword });
  return newPassword;
};

/**
 * update email
 * @param {String} userId
 * @param {String} email
 * @returns {Promise<User>}
 */
const updateEmail = async (userId, email) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (user.email === email) {
    return user;
  }
  if (await User.isEmailTaken(email, userId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, { email, isEmailVerified: false });
  await user.save();
  return user;
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  generateNewPassword,
  updateEmail,
};
