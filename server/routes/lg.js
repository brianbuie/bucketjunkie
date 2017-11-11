const express = require('express');
const auth = require('../controllers/authController');
const league = require('../controllers/leagueController');
const app = require('../controllers/appController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

router.use('/:id', catchErrors(auth.useParam));
router.get('/:id', auth.isMember, (req, res) => res.redirect('/dash'));
router.get('/:id/join', auth.isLoggedIn, catchErrors(league.joinLeague));
router.post('/:id/leave', auth.isMember, auth.notCreator, catchErrors(league.leaveLeague));
router.get('/:id/edit', auth.isModerator, league.editLeagueForm);
router.post('/:id/edit', auth.isModerator, league.validateLeague, catchErrors(league.updateLeague));
router.post('/:id/members/remove', auth.isModerator, catchErrors(league.removeMember));
router.post('/:id/moderators/add', auth.isCreator, catchErrors(league.addModerator));
router.post('/:id/moderators/remove', auth.isCreator, catchErrors(league.removeModerator));

module.exports = router;
