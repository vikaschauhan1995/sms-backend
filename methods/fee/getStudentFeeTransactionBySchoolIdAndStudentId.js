const { studentFee_table } = require("../../constants/studentFee_table");
const db = require("../../db");


async function getStudentFeeTransactionBySchoolIdAndStudentId(school_id, student_id) {
  const getQuery = `SELECT id,
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
            ${studentFee_table.CREATED_BY},
            ${studentFee_table.CREATED_DATE},
            TO_CHAR(
                ${studentFee_table.CREATED_ON} AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata',
                'YYYY-MM-DD HH24:MI:SS'
            ) AS ${studentFee_table.CREATED_ON}
            FROM fee_transactions WHERE 
        ${studentFee_table.SCHOOL_ID} = $1 AND ${studentFee_table.STUDENT_ID} = $2
        ORDER BY id DESC`;
  const transactions = await db.query(getQuery, [school_id, student_id]);
  return transactions?.rows;
}

module.exports = {
  getStudentFeeTransactionBySchoolIdAndStudentId,
};
