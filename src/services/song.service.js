const httpStatus = require('http-status');
const { Song, Playlist } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Get song by id
 * @param {ObjectId} id
 * @returns {Promise<Song>}
 */
const getSongById = async (id) => {
  return Song.findById(id);
};

/**
 * create a song
 * @param {Object} songBody
 * @returns {Promise<Song>}
 */
const createSong = async (songBody) => {
  const playlist = await Playlist.findById(songBody.playlistId);
  if (!playlist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Playlist invalid');
  }
  const song = await Song.create(songBody);
  return song;
};

/**
 * delete a song
 * @param {string} songId
 * @returns {Promise<Song>}
 */
const deleteSong = async (songId) => {
  const song = await Song.findById(songId);
  if (!song) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Song invalid');
  }
  await song.remove();
  return song;
};

module.exports = {
  getSongById,
  createSong,
  deleteSong,
};
