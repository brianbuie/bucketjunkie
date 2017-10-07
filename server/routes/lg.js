const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../controllers/authController');
const leagueMember = require('../controllers/leagueMemberCtrl');
const leagueInfo = require('../controllers/leagueInfoCtrl');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

router.use('/:id', catchErrors(auth.useParam));
router.get('/:id', catchErrors(leagueInfo.leagueOverview));

router.use(auth.isLoggedIn);
router.get('/:id/join', catchErrors(leagueMember.joinLeague));
router.post('/:id/chat', auth.isMember, leagueInfo.validateChat, leagueInfo.chat);
router.get('/:id/leave', auth.isMember, auth.notCreator, leagueMember.confirmLeaveLeague);
router.post('/:id/leave', auth.isMember, auth.notCreator, catchErrors(leagueMember.leaveLeague));
router.get('/:id/edit', auth.isModerator, leagueInfo.editLeagueForm);
router.post('/:id/edit', auth.isModerator, leagueInfo.validateUpdate, catchErrors(leagueInfo.updateLeague));
router.post('/:id/members/remove', auth.isModerator, catchErrors(leagueMember.removeMember));
router.post('/:id/moderators/add', auth.isCreator, catchErrors(leagueMember.addModerator));
router.post('/:id/moderators/remove', auth.isCreator, catchErrors(leagueMember.removeModerator));

module.exports = router;
