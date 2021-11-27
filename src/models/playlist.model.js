const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const playlistSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
  },
  songs: {
    type: [String],
    default: [],
  },
  rate: {
    type: Number,
    default: 0,
  },
  view: {
    type: Number,
    default: 0,
  },
});

playlistSchema.virtual('songsPopulate', {
  ref: 'songs',
  localField: 'songs',
  foreignField: '_id',
});

playlistSchema.set('toObject', { virtuals: true });
playlistSchema.set('toJSON', { virtuals: true });

// add plugin that converts mongoose to json
playlistSchema.plugin(toJSON);
playlistSchema.plugin(paginate);

/**
 * @typedef Playlist
 */
const Playlist = mongoose.model('playlists', playlistSchema, 'playlists');

module.exports = Playlist;
