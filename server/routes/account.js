const express = require('express');
const user = require('../controllers/userController');
const app = require('../controllers/appController');
const auth = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

router.get('/', auth.isLoggedIn, catchErrors(auth.useSession), catchErrors(app.dashboard));
router.post('/', user.uploadPhoto, catchErrors(user.resizePhoto), catchErrors(user.updateAccount));
router.get('/forgot-password', user.forgotPasswordForm);
router.post('/forgot-password', catchErrors(user.createResetToken));
router.get('/login', catchErrors(app.dashboard));
router.post('/login', user.login);
router.get('/logout', user.logout);
router.get('/register', user.registerForm);
router.post('/register', catchErrors(user.validateRegister), catchErrors(user.register), user.login);
router.get('/reset-password/:token', catchErrors(user.resetPasswordForm));
router.post('/reset-password/:token', user.validatePasswordReset, catchErrors(user.updatePassword));

module.exports = router;
