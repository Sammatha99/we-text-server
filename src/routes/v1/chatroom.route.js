const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { chatroomValidation } = require('../../validations');
const { chatroomController } = require('../../controllers');

const router = express.Router();

// thêm chatroom
// lấy chatroom mà userId trong member có thể search
router
  .route('/')
  .post(auth('manageChatrooms'), validate(chatroomValidation.createChatroom), chatroomController.createChatroom)
  .get(auth('manageChatrooms'), validate(chatroomValidation.getChatrooms), chatroomController.getChatrooms);

// get chatroom by id
// update chatroom name
router
  .route('/:chatroomId')
  .get(auth('manageChatrooms'), validate(chatroomValidation.getChatroom), chatroomController.getChatRoomById)
  .patch(auth('manageChatrooms'), validate(chatroomValidation.updateChatroomName), chatroomController.updateChatroomName);

// add / delete member to chatroom
router
  .route('/:chatroomId/add-member')
  .patch(auth('manageChatrooms'), validate(chatroomValidation.updateChatroomMember), chatroomController.addMemberToChatroom);

router
  .route('/:chatroomId/delete-member')
  .patch(
    auth('manageChatrooms'),
    validate(chatroomValidation.updateChatroomMember),
    chatroomController.deleteMemberOutOfChatroom
  );

// update seen history
router
  .route('/:chatroomId/seen-history')
  .patch(
    auth('manageChatrooms'),
    validate(chatroomValidation.updateChatroomSeenHistory),
    chatroomController.updateSeenHistory
  );

module.exports = router;
