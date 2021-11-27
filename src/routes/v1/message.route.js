const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { messageValidation } = require('../../validations');
const { messageController } = require('../../controllers');

const router = express.Router();
// thêm message => update lastmessage trong chatroomId
// get messages

router
  .route('/')
  .post(auth('manageMessages'), validate(messageValidation.createMessage), messageController.createMessage)
  .get(auth('manageMessages'), validate(messageValidation.getMessages), messageController.getMessages);

module.exports = router;
