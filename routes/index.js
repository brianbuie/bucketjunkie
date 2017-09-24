const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', (req, res) => {
  res.render('index');
});

// users
router.get('/account/login', userController.loginForm);
router.get('/account/register', userController.registerForm);
router.get('/account/forgot-password', userController.forgotPassword);

router.post('/account/register', 
  userController.validateRegister,
  userController.register
);

module.exports = router;