const express = require('express');
const school = require('../constants/classes_table');
const router = express.Router();

const { saveClass, updateClass, getAllClassesBySchoolIdAndCreatedYear, deleteClassByClassId, getClass, getClassList } = require('../controllers/classesController');
const classes_table = require('../constants/classes_table');

router.get('/', getClassList);
router.post('/', saveClass);
router.put(`/:id`, updateClass);
router.get(`/:${classes_table?.CREATED_YEAR}/:${classes_table?.SCHOOL_ID}`, getAllClassesBySchoolIdAndCreatedYear);
router.delete(`/:id`, deleteClassByClassId);
router.get(`/:id`, getClass)

module.exports = router;