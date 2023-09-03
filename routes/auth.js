const express = require('express');

const router = express.Router();

const { createAdmin, loginUser } = require('../controllers/authController.js');

router.post('/createAdmin', createAdmin);
router.post('/login', loginUser);

module.exports = router;