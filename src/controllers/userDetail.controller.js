const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { userDetailService } = require('../services');

const getUserDetailById = catchAsync(async (req, res) => {
  const userDetail = await userDetailService.getUserDetailById(req.params.userId);
  res.send(userDetail);
});

const getFollowersOfUserById = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const { userId } = req.params;
  const users = await userDetailService.getFollowersOfUserById(userId, filter, options);
  res.send(users);
});

const getFollowingsOfUserById = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const { userId } = req.params;
  const users = await userDetailService.getFollowingsOfUserById(userId, filter, options);
  res.send(users);
});

const getContactsOfUserById = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const { userId } = req.params;
  const users = await userDetailService.getContactsOfUserById(userId, filter, options);
  res.send(users);
});

const createUserDetail = catchAsync(async (req, res) => {
  const userDetail = await userDetailService.createUserDetail(req.params.userId, req.body);
  res.status(httpStatus.CREATED).send(userDetail);
});

const updateUserDetailById = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const userDetail = await userDetailService.updateUserDetailById(userId, req.body);
  res.send(userDetail);
});

const deleteUserOutOfFollowers = catchAsync(async (req, res) => {
  await userDetailService.deleteUserOutOfFollowers(req.params.userId, req.body.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const addUserToFollowers = catchAsync(async (req, res) => {
  const userDetail = await userDetailService.addUserToFollowers(req.params.userId, req.body.userId);
  res.send(userDetail);
});

const deleteUserOutOfFollowings = catchAsync(async (req, res) => {
  await userDetailService.deleteUserOutOfFollowings(req.params.userId, req.body.userId);
  await userDetailService.deleteUserOutOfFollowers(req.body.userId, req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const addUserToFollowings = catchAsync(async (req, res) => {
  const userDetail = await userDetailService.addUserToFollowings(req.params.userId, req.body.userId);
  await userDetailService.addUserToFollowers(req.body.userId, req.params.userId);
  res.send(userDetail);
});

const deleteUserOutOfContacts = catchAsync(async (req, res) => {
  await userDetailService.deleteUserOutOfContacts(req.params.userId, req.body.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const addUserToContacts = catchAsync(async (req, res) => {
  const userDetail = await userDetailService.addUserToContacts(req.params.userId, req.body.userId);
  res.send(userDetail);
});

module.exports = {
  getUserDetailById,
  getFollowersOfUserById,
  getFollowingsOfUserById,
  getContactsOfUserById,
  createUserDetail,
  updateUserDetailById,
  deleteUserOutOfFollowers,
  addUserToFollowers,
  deleteUserOutOfFollowings,
  addUserToFollowings,
  deleteUserOutOfContacts,
  addUserToContacts,
};
