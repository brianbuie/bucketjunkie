const express = require('express');
const userController = require('../user/userController');
const leagueAuth = require('../league/leagueAuthService');
const lgMember = require('./lgMemberController');
const lgController = require('./lgController');
const { catchErrors } = require('../error/errorHandlers');

const router = express.Router();

router.use('/:id', catchErrors(leagueAuth.setLeague));
router.use('/:id', leagueAuth.setPermissions);
router.get('/:id', catchErrors(lgController.leagueOverview));

router.use(userController.isLoggedIn);
router.get('/:id/join', catchErrors(lgMember.joinLeague));

router.use(leagueAuth.isMember);
router.get('/:id/leave', leagueAuth.notCreator, lgMember.confirmLeaveLeague);
router.post('/:id/leave', leagueAuth.notCreator, catchErrors(lgMember.leaveLeague));

router.use(leagueAuth.isModerator);
router.get('/:id/edit', lgController.editLeagueForm);
router.post('/:id/edit', catchErrors(lgController.updateLeague));
router.post('/:id/members/remove', catchErrors(lgMember.removeMember));

router.use(leagueAuth.isCreator);
router.post('/:id/moderators/add', catchErrors(lgMember.addModerator));
router.post('/:id/moderators/remove', catchErrors(lgMember.removeModerator));

module.exports = router;
