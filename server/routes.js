const express = require('express');

const router = express.Router();
const userRoutes = require('../modules/user/userRoutes');
const leagueRoutes = require('../modules/league/leagueRoutes');

router.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});
router.use('/account', userRoutes);
router.use('/leagues', leagueRoutes);

module.exports = router;
