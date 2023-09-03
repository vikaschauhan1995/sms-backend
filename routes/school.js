const express = require('express');
const school = require('../constants/school_table');
const router = express.Router();

const { createSchool, getSchools, getSchool, updateSchool, deleteSchool } = require('../controllers/schoolController');


router.post('/', createSchool);
router.get('/', getSchools);
router.get(`/:${school.SCHOOL_ID}`, getSchool);
router.put(`/:${school.SCHOOL_ID}`, updateSchool);
router.delete(`/:${school.SCHOOL_ID}`, deleteSchool);

module.exports = router;