const mongoose = require('mongoose');

exports.loginForm = (req, res) => {
  res.render('account/login', { title: 'Login' });
}

exports.registerForm = (req, res) => {
  res.render('account/register', { title: 'Register' });
}

exports.forgotPassword = (req, res) => {
  res.render('account/forgot-password', { title: 'Forgot Password' });
}