const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const { userDetailValidation } = require('../../validations');
const { userDetailController } = require('../../controllers');

const router = express.Router();

// thêm userDetail
// update userDetail
// get userDetail by id
router
  .route('/:userId')
  .post(auth('manageUsers'), validate(userDetailValidation.createUserDetail), userDetailController.createUserDetail)
  .patch(auth('manageUsers'), validate(userDetailValidation.updateUserDetail), userDetailController.updateUserDetailById)
  .get(validate(userDetailValidation.getUserDetail), userDetailController.getUserDetailById);

// get followers
router
  .route('/:userId/followers')
  .get(
    auth('manageUsers'),
    validate(userDetailValidation.getUsersArrayOfUserDetail),
    userDetailController.getFollowersOfUserById
  );

// get followings
router
  .route('/:userId/followings')
  .get(
    auth('manageUsers'),
    validate(userDetailValidation.getUsersArrayOfUserDetail),
    userDetailController.getFollowingsOfUserById
  );

// get contacts
router
  .route('/:userId/contacts')
  .get(
    auth('manageUsers'),
    validate(userDetailValidation.getUsersArrayOfUserDetail),
    userDetailController.getContactsOfUserById
  );

// thêm/xóa followers-followings-contacts
router
  .route('/:userId/delete-follower')
  .patch(
    auth('manageUsers'),
    validate(userDetailValidation.updateUserDetailArray),
    userDetailController.deleteUserOutOfFollowers
  );

router
  .route('/:userId/add-follower')
  .patch(auth('manageUsers'), validate(userDetailValidation.updateUserDetailArray), userDetailController.addUserToFollowers);

router
  .route('/:userId/delete-following')
  .patch(
    auth('manageUsers'),
    validate(userDetailValidation.updateUserDetailArray),
    userDetailController.deleteUserOutOfFollowings
  );

router
  .route('/:userId/add-following')
  .patch(
    auth('manageUsers'),
    validate(userDetailValidation.updateUserDetailArray),
    userDetailController.addUserToFollowings
  );

router
  .route('/:userId/delete-contact')
  .patch(
    auth('manageUsers'),
    validate(userDetailValidation.updateUserDetailArray),
    userDetailController.deleteUserOutOfContacts
  );

router
  .route('/:userId/add-contact')
  .patch(auth('manageUsers'), validate(userDetailValidation.updateUserDetailArray), userDetailController.addUserToContacts);

module.exports = router;
