const express = require('express');
const userController = require('../user/userController');
const lgAuth = require('./lgAuthService');
const lgMember = require('./lgMemberController');
const leagueController = require('./leagueController');
const { catchErrors } = require('../error/errorHandlers');

const router = express.Router();

router.use('/:id', catchErrors(lgAuth.setLeague));
router.use('/:id', lgAuth.setPermissions);
router.get('/:id', catchErrors(leagueController.leagueOverview));

router.use(userController.isLoggedIn);
router.get('/:id/join', catchErrors(lgMember.joinLeague));

router.use(lgAuth.isMember);
router.get('/:id/leave', lgAuth.notCreator, lgMember.confirmLeaveLeague);
router.post('/:id/leave', lgAuth.notCreator, catchErrors(lgMember.leaveLeague));

router.use(lgAuth.isModerator);
router.get('/:id/edit', leagueController.editLeagueForm);
router.post('/:id/edit', catchErrors(leagueController.updateLeague));
router.post('/:id/members/remove', catchErrors(lgMember.removeMember));

router.use(lgAuth.isCreator);
router.post('/:id/moderators/add', catchErrors(lgMember.addModerator));
router.post('/:id/moderators/remove', catchErrors(lgMember.removeModerator));

module.exports = router;
