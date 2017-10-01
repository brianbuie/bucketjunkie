const express = require('express');

const router = express.Router();
const userRoutes = require('../modules/user/userRoutes');
const leagueRoutesLeagues = require('../modules/league/leagueRoutesLeagues');
const leagueRoutesLg = require('../modules/league/leagueRoutesLg');
const nbaRoutes = require('../modules/nba/nbaRoutes');

router.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});
router.use('/account', userRoutes);
router.use('/leagues', leagueRoutesLeagues);
router.use('/lg', leagueRoutesLg)
router.use('/nba', nbaRoutes);

module.exports = router;
