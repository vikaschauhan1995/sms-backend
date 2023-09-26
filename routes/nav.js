const express = require('express');
const router = express.Router();
const { getNavListByUserType } = require('../controllers/navController');


router.get('/:user_type', getNavListByUserType);

module.exports = router;