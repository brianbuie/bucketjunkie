const express = require('express');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');

const router = express.Router();
const User = mongoose.model('User');
const userController = require('./userController');
const { catchErrors } = require('../error/errorHandlers');

router.use(expressValidator({
  customValidators: {
    isUsernameAvailable(username) {
      return new Promise((resolve, reject) => {
        User.findOne({ username }, (err, user) => {
          if (err) throw err;
          if (!user) resolve();
          reject();
        });
      });
    },
  },
}));

router.get('/', userController.isLoggedIn, userController.account);
router.post('/', userController.uploadPhoto, catchErrors(userController.resizePhoto), catchErrors(userController.updateAccount));
router.get('/forgot-password', userController.forgotPasswordForm);
router.post('/forgot-password', catchErrors(userController.createResetToken));
router.get('/login', userController.loginForm);
router.post('/login', userController.login);
router.get('/logout', userController.logout);
router.get('/register', userController.registerForm);
router.post('/register', userController.validateRegister, catchErrors(userController.register), userController.login);
router.get('/reset-password/:token', catchErrors(userController.resetPasswordForm));
router.post('/reset-password/:token', userController.validatePasswordReset, catchErrors(userController.updatePassword));

module.exports = router;
