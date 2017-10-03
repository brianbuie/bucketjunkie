const express = require('express');
const userController = require('../../user/userController');
const leagueAuth = require('../auth/leagueAuthService');
const leagueMember = require('../member/leagueMemberCtrl');
const leagueInfo = require('../info/leagueInfoCtrl');
const { catchErrors } = require('../../error/errorHandlers');

const router = express.Router();

router.use('/:id', catchErrors(leagueAuth.setLeague));
router.use('/:id', leagueAuth.setPermissions);
router.get('/:id', catchErrors(leagueInfo.leagueOverview));

router.use(userController.isLoggedIn);
router.get('/:id/join', catchErrors(leagueMember.joinLeague));

router.use(leagueAuth.isMember);
router.get('/:id/leave', leagueAuth.notCreator, leagueMember.confirmLeaveLeague);
router.post('/:id/leave', leagueAuth.notCreator, catchErrors(leagueMember.leaveLeague));

router.use(leagueAuth.isModerator);
router.get('/:id/edit', leagueInfo.editLeagueForm);
router.post('/:id/edit', catchErrors(leagueInfo.updateLeague));
router.post('/:id/members/remove', catchErrors(leagueMember.removeMember));

router.use(leagueAuth.isCreator);
router.post('/:id/moderators/add', catchErrors(leagueMember.addModerator));
router.post('/:id/moderators/remove', catchErrors(leagueMember.removeModerator));

module.exports = router;
