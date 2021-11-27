const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getSong = {
  params: Joi.object().keys({
    songId: Joi.string().custom(objectId),
  }),
};

const createSong = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    source: Joi.string().required(),
    image: Joi.string().required(),
    author: Joi.string().required(),
    playlistId: Joi.string().required(),
  }),
};

const deleteSong = {
  params: Joi.object().keys({
    songId: Joi.string().required(),
  }),
};

module.exports = { getSong, createSong, deleteSong };
