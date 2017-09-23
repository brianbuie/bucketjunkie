const mongoose = require('mongoose');

exports.loginForm = (req, res) => {
	res.send('login');
}

exports.registerForm = (req, res) => {
	res.send('register');
}