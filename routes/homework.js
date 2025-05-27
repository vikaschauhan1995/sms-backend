const express = require('express');
const { saveHomework, getHomeworkByClassIdAndDate, updateHomework, deleteHomeworkById } = require('../controllers/homeworkController');
const homework_table = require('../constants/homework_table');
const router = express.Router();


router.post('/', saveHomework);
router.get(`/${homework_table.CLASS_ID}/:${homework_table.CLASS_ID}/${homework_table.CREATED_DATE}/:${homework_table.CREATED_DATE}`, getHomeworkByClassIdAndDate);
router.put(`/:id`, updateHomework);
router.delete(`/:id`, deleteHomeworkById);

module.exports = router;