const Joi = require('joi');
const { objectId } = require('./custom.validation');

// get by id
const getUserDetail = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const createUserDetail = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    description: Joi.string(),
    address: Joi.string(),
    phoneNumber: Joi.string(),
  }),
  // .min(1),
};

// update
const updateUserDetail = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      description: Joi.string(),
      address: Joi.string(),
      phoneNumber: Joi.string(),
      playlist: Joi.string(),
    })
    .min(1),
};

// add-delete followers/followings/contacts
const updateUserDetailArray = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

module.exports = {
  createUserDetail,
  updateUserDetail,
  updateUserDetailArray,
  getUserDetail,
};
