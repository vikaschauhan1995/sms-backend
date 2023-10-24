const express = require('express');
const school = require('../constants/classes_table');
const router = express.Router();

const { saveClass, updateClass, getAllClassesBySchoolId, deleteClassByClassId } = require('../controllers/classesController');
const classes_table = require('../constants/classes_table');


router.post('/', saveClass);
router.put(`/:id`, updateClass);
router.get(`/all/:${classes_table?.SCHOOL_ID}`, getAllClassesBySchoolId);
router.delete(`/:id`, deleteClassByClassId);

module.exports = router;