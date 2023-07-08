const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.route('/register')
  .post(userController.registerUser);

router.route('/login')
  .post(userController.loginUser);

router.route('/user')
  .get(userController.getUserDetails);

router.route('/forgot-password')
  .post(userController.forgotPassword);

router.route('/reset-password/:token')
  .get(userController.resetPassword);

router.route('/new-password/:token')
  .post(userController.newPassword);

module.exports = router;