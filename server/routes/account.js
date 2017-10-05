const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');
const { catchErrors } = require('../handlers/errorHandlers');

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
