const express = require('express');

const router = express.Router();
router.get('/', (req, res) => res.render('index', { title: 'Home' }));
router.use('/account', require('./account'));
router.use('/leagues', require('./leagues'));
router.use('/lg', require('./lg'));
router.use('/nba', require('./nba'));
router.use('/roster', require('./roster'));

module.exports = router;
