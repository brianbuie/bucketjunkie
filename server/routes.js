const express = require('express');
const userRoutes = require('../modules/user/userRoutes');
const leagueRoutesLeagues = require('../modules/league/leagueRoutesLeagues');
const leagueRoutesLg = require('../modules/league/leagueRoutesLg');
const nbaRoutes = require('../modules/nba/nbaRoutes');
const rosterRoutes = require('../modules/roster/rosterRoutes');

const router = express.Router();
router.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});
router.use('/account', userRoutes);
router.use('/leagues', leagueRoutesLeagues);
router.use('/lg', leagueRoutesLg)
router.use('/nba', nbaRoutes);
router.use('/roster', rosterRoutes);

module.exports = router;
