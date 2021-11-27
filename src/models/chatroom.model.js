const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const chatroomSchema = mongoose.Schema(
  {
    isGroupChat: {
      type: Boolean,
      required: true,
    },
    name: {
      type: String,
    },
    members: {
      type: [{ type: String, index: true }],
      required: true,
      default: [],
    },
    outGroupMembers: {
      type: [String],
      default: [],
    },
    lastMessage: {
      type: String,
      trim: true,
    },
    seenHistory: {
      type: Map,
      of: String,
    },
    time: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

chatroomSchema.index({ name: 'text' }, { members: 'text' });

chatroomSchema.virtual('membersPopulate', {
  ref: 'users',
  localField: 'members',
  foreignField: '_id',
});

chatroomSchema.virtual('outGroupMembersPopulate', {
  ref: 'users',
  localField: 'outGroupMembers',
  foreignField: '_id',
});

chatroomSchema.virtual('lastMessagePopulate', {
  ref: 'messages',
  localField: 'lastMessage',
  foreignField: '_id',
  justOne: true,
});

chatroomSchema.set('toObject', { virtuals: true });
chatroomSchema.set('toJSON', { virtuals: true });

// add plugin that converts mongoose to json
chatroomSchema.plugin(toJSON);
chatroomSchema.plugin(paginate);

/**
 * Check if chatroom which not groupchat is exist
 * @param {[String]} userIds - The user's email
 * @returns {Promise<boolean>}
 */
chatroomSchema.statics.isPeerToPeerExist = async function (userIds) {
  const chatroom = await this.findOne({ members: userIds, isGroupChat: false });
  return chatroom;
};

/**
 * @typedef Chatroom
 */
const Chatroom = mongoose.model('chatrooms', chatroomSchema, 'chatrooms');

module.exports = Chatroom;
