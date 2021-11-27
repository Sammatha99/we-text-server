const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { userDetailService } = require('../services');

const getUserDetailById = catchAsync(async (req, res) => {
  const userDetail = userDetailService.getUserDetailById(req.params.userId);
  res.send(userDetail);
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
  res.status(httpStatus.NO_CONTENT).send();
});

const addUserToFollowings = catchAsync(async (req, res) => {
  const userDetail = await userDetailService.addUserToFollowings(req.params.userId, req.body.userId);
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
  createUserDetail,
  updateUserDetailById,
  deleteUserOutOfFollowers,
  addUserToFollowers,
  deleteUserOutOfFollowings,
  addUserToFollowings,
  deleteUserOutOfContacts,
  addUserToContacts,
};
