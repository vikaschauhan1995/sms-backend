const db = require("../db");
const classes_table = require("../constants/classes_table");
const { studentFee_table } = require("../constants/studentFee_table");
const { getClassObjById } = require("../methods/classes_methods/getClassById");
const { getStudentObjByStudentId } = require("../methods/student_methods/getStudentObjByStudentId");
const student_table = require("../constants/student_table");
const {getFiniteNumber} = require("../utility/getFiniteNumber");
const {isValidDate} = require("../utility/isValidDate");
const {getNanoid} = require("../utility/getNanoid");
const { getStudentFeeTransactionBySchoolIdAndStudentId } = require("../methods/fee/getStudentFeeTransactionBySchoolIdAndStudentId");

const saveStudentFee = async (req, res) => {
    try {
        const { class_id, student_id, month, amount_paid, payment_date, description } = req.body;
        const { user_id, school_id } = req?.user;

        if (!user_id) throw Error("user_id not available");
        if (!school_id) throw Error("school_id not available");    

        if (!class_id) throw Error("class_id not available");
        if (!student_id) throw Error("student_id not available");
        if (!month) throw Error("month not available");
        if (!amount_paid) throw Error("amount_paid not available");
        if (!payment_date) throw Error("payment_date not available");
        if (!description) throw Error("description not available");

        const classObj = await getClassObjById(class_id);
        const className = classObj?.[classes_table.CLASS_NAME];
        const section = classObj?.[classes_table.SECTION];
        if(!className || !section) throw Error('Class id is not valid');
        
        const student = await getStudentObjByStudentId(student_id);
        const studentFirstName = student?.[student_table.FIRST_NAME];
        const studentLastName = student?.[student_table.LAST_NAME];
        const studentRollNumber = student?.[student_table.ROLL_NUMBER];
        if(!studentFirstName || !studentLastName || !studentRollNumber) throw Error('Student id is not valid');

        const amountPaidFiniteNumber = await getFiniteNumber(amount_paid);
        if (!amountPaidFiniteNumber) throw Error("Amount paid must be a number");
        const fee_amount = classObj?.[classes_table.FEE];
        if (amount_paid > fee_amount) {
            throw Error("Amount pay can't be greater than fee amount");
        }

        const isPaymentDateValid = isValidDate(payment_date);
        if (!isPaymentDateValid) throw Error("Payment date is not valid");

        const transactionId = getNanoid(10);

        const insertQuery = `
        INSERT INTO fee_transactions (
            ${studentFee_table.TRANSACTION_ID},
            ${studentFee_table.SCHOOL_ID},
            ${studentFee_table.MONTH},
            ${studentFee_table.CLASS_ID},
            ${studentFee_table.CLASS_NAME},
            ${studentFee_table.STUDENT_ID},
            ${studentFee_table.STUDENT_NAME},
            ${studentFee_table.ROLL_NUMBER},
            ${studentFee_table.FEE_AMOUNT},
            ${studentFee_table.AMOUNT_PAID},
            ${studentFee_table.PAYMENT_DATE},
            ${studentFee_table.DESCRIPTION},
            ${studentFee_table.CREATED_BY}
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *;`;

        const classNameWithSection = `${className}-${section}`;
        const insertResponse = await db.query(insertQuery, [
            transactionId, 
            school_id, 
            month, 
            class_id, 
            classNameWithSection, 
            student_id,
            `${studentFirstName} ${studentLastName}`,
            studentRollNumber,
            fee_amount,
            amount_paid,
            payment_date,
            description,
            user_id
        ]);
        res.status(200).json({
            message:'Fee transaction saved successfully',
            data:insertResponse?.rows[0]
        });
    }catch(error){
        res.status(400).json({ error: error.message });
    }
}

const getFeeTransactionsByStudentId = async (req, res) => {
    try {
        const { student_id } = req?.params;
        const { user_id, school_id } = req?.user;
        if (!user_id) throw Error("user_id not available");
        if (!school_id) throw Error("school_id not available");  

        const student = await getStudentObjByStudentId(student_id);
        if(!student) throw Error('Student id is not valid');

        const getResponse = await getStudentFeeTransactionBySchoolIdAndStudentId(school_id, student_id);
        res.status(200).json(getResponse);
    }catch(error){
        res.status(400).json({ error: error.message });
    }
}

const getMyFeeTransactionsAsStudent = async (req, res) => {
    try {
        const { user_id, school_id } = req?.user;
        if (!user_id) throw Error("user_id not available");
        if (!school_id) throw Error("school_id not available");  

        const getResponse = await getStudentFeeTransactionBySchoolIdAndStudentId(school_id, user_id);
        res.status(200).json(getResponse);
    } catch(error){
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    saveStudentFee,
    getFeeTransactionsByStudentId,
    getMyFeeTransactionsAsStudent
}