const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const userDetailSchema = mongoose.Schema(
  {
    description: {
      type: String,
    },
    address: {
      type: String,
    },
    phoneNumber: {
      type: String,
      maxlength: 12,
      validate(value) {
        if (value.length !== 0 && (!value.match(/\d/) || !value.match(/[0-9]/))) {
          throw new Error('phone number must contain only number');
        }
      },
    },
    playlist: {
      type: String,
      trim: true,
    },
    followers: {
      type: [String],
      default: [],
    },
    followings: {
      type: [String],
      default: [],
    },
    contacts: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

userDetailSchema.virtual('playlistPopulate', {
  ref: 'playlists',
  localField: 'playlist',
  foreignField: '_id',
});

userDetailSchema.virtual('followersPopulate', {
  ref: 'users',
  localField: 'followers',
  foreignField: '_id',
});

userDetailSchema.virtual('followingsPopulate', {
  ref: 'users',
  localField: 'followings',
  foreignField: '_id',
});

userDetailSchema.virtual('contactsPopulate', {
  ref: 'users',
  localField: 'contacts',
  foreignField: '_id',
});

userDetailSchema.set('toObject', { virtuals: true });
userDetailSchema.set('toJSON', { virtuals: true });

// add plugin that converts mongoose to json
userDetailSchema.plugin(toJSON);
userDetailSchema.plugin(paginate);

/**
 * @typedef UserDetail
 */
const UserDetail = mongoose.model('userDetails', userDetailSchema, 'userDetails');

module.exports = UserDetail;
