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
      description: Joi.string().allow('', null),
      address: Joi.string().allow('', null),
      phoneNumber: Joi.string().allow('', null),
      playlist: Joi.string().allow('', null),
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

const getUsersArrayOfUserDetail = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createUserDetail,
  updateUserDetail,
  updateUserDetailArray,
  getUserDetail,
  getUsersArrayOfUserDetail,
};
