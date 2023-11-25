const express = require('express');
const router = express.Router();

const { getSessionYears } = require('../controllers/sessionYearController');


router.get('/', getSessionYears);

module.exports = router;