const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../services/leagueAuthService');
const leagueMember = require('../controllers/leagueMemberCtrl');
const leagueInfo = require('../controllers/leagueInfoCtrl');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

router.use('/:id', catchErrors(auth.paramLeague));
router.use('/:id', auth.setPermissions);
router.get('/:id', catchErrors(leagueInfo.leagueOverview));

router.use(userController.isLoggedIn);
router.get('/:id/join', catchErrors(leagueMember.joinLeague));
router.get('/:id/leave', auth.isMember, auth.notCreator, leagueMember.confirmLeaveLeague);
router.post('/:id/leave', auth.isMember, auth.notCreator, catchErrors(leagueMember.leaveLeague));
router.get('/:id/edit', auth.isModerator, leagueInfo.editLeagueForm);
router.post('/:id/edit', auth.isModerator, catchErrors(leagueInfo.updateLeague));
router.post('/:id/members/remove', auth.isModerator, catchErrors(leagueMember.removeMember));
router.post('/:id/moderators/add', auth.isCreator, catchErrors(leagueMember.addModerator));
router.post('/:id/moderators/remove', auth.isCreator, catchErrors(leagueMember.removeModerator));

module.exports = router;
