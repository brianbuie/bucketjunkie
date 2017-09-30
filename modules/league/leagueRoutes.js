const express = require('express');

const router = express.Router();
const userController = require('../user/userController');
const leagueController = require('./leagueController');
const { catchErrors } = require('../error/errorHandlers');

router.get('/public', catchErrors(leagueController.publicLeagues));

router.use(userController.isLoggedIn);
router.get('/', catchErrors(leagueController.myLeagues));
router.get('/create', leagueController.createLeagueForm);
router.post('/create', catchErrors(leagueController.createLeague));
router.get('/:id', catchErrors(leagueController.leagueOverview));
router.get('/:id/join', catchErrors(leagueController.joinLeague));
router.get('/:id/edit', catchErrors(leagueController.isModerator), leagueController.editLeagueForm);
router.post('/:id/edit', catchErrors(leagueController.isModerator), catchErrors(leagueController.updateLeague));
router.post('/:id/users', catchErrors(leagueController.isModerator), catchErrors(leagueController.updateUser));

module.exports = router;
