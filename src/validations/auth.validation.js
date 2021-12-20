const Joi = require('joi');
const { password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    avatar: Joi.string(),
    status: Joi.boolean().default(true),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    id: Joi.string().required(),
    password: Joi.string().required(),
    newPassword: Joi.string().required().custom(password),
  }),
};

const sendVerifyEmail = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    id: Joi.string().required(),
  }),
};

const verifyEmail = {
  body: Joi.object().keys({
    otp: Joi.string().required(),
    id: Joi.string().required(),
  }),
};

const updateEmail = {
  body: Joi.object().keys({
    userId: Joi.string().required(),
    email: Joi.string().required().email(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerifyEmail,
  verifyEmail,
  updateEmail,
};
