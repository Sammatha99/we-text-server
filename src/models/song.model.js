const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const songSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  source: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
  },
  author: {
    type: String,
    require: true,
  },
});

songSchema.set('toObject', { virtuals: true });
songSchema.set('toJSON', { virtuals: true });

// add plugin that converts mongoose to json
songSchema.plugin(toJSON);
songSchema.plugin(paginate);

/**
 * @typedef Song
 */
const Song = mongoose.model('songs', songSchema, 'songs');

module.exports = Song;
