const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { playlistValidation } = require('../../validations');
const { playlistController } = require('../../controllers');

const router = express.Router();

// thêm playlist
router
  .route('/')
  .post(auth('managePlaylists'), validate(playlistValidation.createPlaylist), playlistController.createPlaylist);

// get playlist by Id
router.route('/:playlistId').get(validate(playlistValidation.getPlaylist), playlistController.getPlaylistById);

// delete a song out of playlist => delete trong collections song by songId
router
  .route('/:playlistId/delete-song')
  .patch(
    auth('managePlaylists'),
    validate(playlistValidation.updatePlaylistSongs),
    playlistController.deteleSongOutOfPlaylist
  );

module.exports = router;
