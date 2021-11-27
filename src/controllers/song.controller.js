const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { songService, playlistService } = require('../services');

const getSongById = catchAsync(async (req, res) => {
  const song = songService.getSongById(req.params.songId);
  res.send(song);
});

const createSong = catchAsync(async (req, res) => {
  const song = await songService.createSong(req.body);
  await playlistService.addSongToPlaylist(req.body.playlistId, song.id);
  res.status(httpStatus.CREATED).send(song);
});

module.exports = {
  getSongById,
  createSong,
};
