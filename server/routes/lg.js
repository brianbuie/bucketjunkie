const express = require('express');
const auth = require('../controllers/authController');
const league = require('../controllers/leagueController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

router.use('/:id', catchErrors(auth.useParam));
router.get('/:id', catchErrors(league.leagueOverview));

router.use(auth.isLoggedIn);
router.get('/:id/join', catchErrors(league.joinLeague));
router.post('/:id/chat', auth.isMember, league.validateChat, league.chat);
router.get('/:id/leave', auth.isMember, auth.notCreator, league.confirmLeaveLeague);
router.post('/:id/leave', auth.isMember, auth.notCreator, catchErrors(league.leaveLeague));
router.get('/:id/edit', auth.isModerator, league.editLeagueForm);
router.post('/:id/edit', auth.isModerator, league.validateLeague, catchErrors(league.updateLeague));
router.post('/:id/members/remove', auth.isModerator, catchErrors(league.removeMember));
router.post('/:id/moderators/add', auth.isCreator, catchErrors(league.addModerator));
router.post('/:id/moderators/remove', auth.isCreator, catchErrors(league.removeModerator));

module.exports = router;
