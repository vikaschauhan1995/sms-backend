const express = require('express');
const { saveStudentFee, getFeeTransactionsByStudentId, getMyFeeTransactionsAsStudent } = require('../controllers/studentFeeController');
const { studentFee_table } = require('../constants/studentFee_table');
const router = express.Router();


router.post('/checkout', saveStudentFee);
router.get(`/${studentFee_table.STUDENT_ID}/:${studentFee_table.STUDENT_ID}`, getFeeTransactionsByStudentId);
router.get(`/myFee`, getMyFeeTransactionsAsStudent);

module.exports = router;