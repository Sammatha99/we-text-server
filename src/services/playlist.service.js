const httpStatus = require('http-status');
const { Playlist } = require('../models');
const ApiError = require('../utils/ApiError');
const songService = require('./song.service');

/**
 * Get playlist by id
 * @param {ObjectId} id
 * @returns {Promise<Playlist>}
 */
const getPlaylistById = async (id) => {
  return Playlist.findById(id).populate({ path: 'songsPopulate' });
};

/**
 * create a playlist
 * @param {Object} playlistBody
 * @returns {Promise<Playlist>}
 */
const createPlaylist = async (playlistBody) => {
  return Playlist.create(playlistBody);
};

/**
 * delete a song in playlist
 * @param {String} playlistId
 * @param {String} songId
 * @returns {Promist<Playlist>}
 */
const deleteSongOutOfPlaylist = async (playlistId, songId) => {
  const playlist = await getPlaylistById(playlistId);
  if (!playlist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Playlist not found');
  }
  const newSongs = playlist.songs.filter((song) => song !== songId);
  Object.assign(playlist, { songs: newSongs });
  await playlist.save();
  return playlist;
};

/**
 * add a song in playlist
 * @param {String} playlistId
 * @param {String} songId
 * @returns {Promist<Playlist>}
 */
const addSongToPlaylist = async (playlistId, songId) => {
  const playlist = await getPlaylistById(playlistId);
  if (!playlist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Playlist not found');
  }
  const song = await songService.getSongById(songId);
  if (!song) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Song not found');
  }
  const newSongs = playlist.songs.push(songId);
  Object.assign(playlist, { songs: newSongs });
  await playlist.save();
  return playlist;
};

module.exports = {
  getPlaylistById,
  createPlaylist,
  deleteSongOutOfPlaylist,
  addSongToPlaylist,
};
