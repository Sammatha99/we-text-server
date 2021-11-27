const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { playlistService, songService } = require('../services');

const getPlaylistById = catchAsync(async (req, res) => {
  const playlist = playlistService.getPlaylistById(req.params.playlistId);
  res.send(playlist);
});

const createPlaylist = catchAsync(async (req, res) => {
  const playlist = await playlistService.createPlaylist(req.body);
  res.status(httpStatus.CREATED).send(playlist);
});

const deteleSongOutOfPlaylist = catchAsync(async (req, res) => {
  const { playlistId } = req.params;
  const { songId } = req.body;
  await playlistService.deleteSongOutOfPlaylist(playlistId, songId);
  await songService.deleteSong(songId);
  res.status(httpStatus.NO_CONTENT).send();
});

const addSongToPlaylist = catchAsync(async (req, res) => {
  const { playlistId } = req.params;
  const { songId } = req.body;
  const playlist = await playlistService.addSongToPlaylist(playlistId, songId);
  res.send(playlist);
});

module.exports = {
  getPlaylistById,
  createPlaylist,
  deteleSongOutOfPlaylist,
  addSongToPlaylist,
};
