const httpStatus = require('http-status');
const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService, userDetailService } = require('../services');

const register = catchAsync(async (req, res) => {
  Object.assign(req.body, { status: true });
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  await userDetailService.createUserDetail(user.id, {});
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  Object.assign(user, { status: true });
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  const userId = mongoose.Types.ObjectId(req.body.userId);
  await userService.updateUserById(userId, { status: false });
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const newPassword = await userService.generateNewPassword(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, newPassword);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.body.id, req.body.password, req.body.newPassword);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateOTPEmailToken(req.body.id);

  await emailService.sendVerificationEmail(req.body.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyOTPEmail(req.body.otp, req.body.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const updateEmail = catchAsync(async (req, res) => {
  const user = await userService.updateEmail(req.body.userId, req.body.email);
  res.send(user);
});

const updateStatus = catchAsync(async (req, res) => {
  // const userId = mongoose.Types.ObjectId(req.body.userId);
  await userService.updateUserById(req.params.userId, { status: req.query.status });
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  updateEmail,
  updateStatus,
};
