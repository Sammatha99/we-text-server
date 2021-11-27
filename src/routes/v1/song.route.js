const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { songValidation } = require('../../validations');
const { songController } = require('../../controllers');

const router = express.Router();

// add song => add trong playlist
router.route('/').post(auth('manageSongs'), validate(songValidation.createSong), songController.createSong);

// get song by id
router.route('/:songId').get(validate(songValidation.getSong), songController.getSongById);

module.exports = router;
