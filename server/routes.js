const express = require('express');

const router = express.Router();
router.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});
router.use('/account', require('../modules/user/userRoutes'));
router.use('/leagues', require('../modules/league/routes/leaguesRoutes'));
router.use('/lg', require('../modules/league/routes/lgRoutes'));
router.use('/nba', require('../modules/nba/nbaRoutes'));
router.use('/roster', require('../modules/roster/rosterRoutes'));

module.exports = router;
