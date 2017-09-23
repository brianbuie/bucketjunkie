const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', (req, res) => {
	res.render('index');
});

// users
router.get('/login', userController.loginForm);
router.get('/register', userController.registerForm);

module.exports = router;