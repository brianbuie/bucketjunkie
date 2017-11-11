const express = require('express');
const auth = require('../controllers/authController');
const app = require('../controllers/appController');
const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

router.use(catchErrors(auth.useSession), catchErrors(app.dashboard));

module.exports = router;