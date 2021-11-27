const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getPlaylist = {
  params: Joi.object().keys({
    playlistId: Joi.string().custom(objectId),
  }),
};

const createPlaylist = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    songs: Joi.array(),
  }),
};

const updatePlaylistSongs = {
  params: Joi.object().keys({
    playlistId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    songId: Joi.string().required().custom(objectId),
  }),
};

module.exports = { getPlaylist, createPlaylist, updatePlaylistSongs };
