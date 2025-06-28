const homework_table = require("../constants/homework_table");
const student_table = require("../constants/student_table");
const db = require("../db");
const { getStudentObjByStudentId } = require("../methods/student_methods/getStudentObjByStudentId");
const { user_type: user_type_variable } = require("../constants/user_type");

const saveHomework = async (req, res) => {
  try {
    const { title, description, class_id, created_date } = req.body;
    const { user_id, school_id, user_type } = req?.user;

    if (!title) throw Error("title is not provided");
    if (!description) throw Error("description is not provided");
    if (!class_id) throw Error("class_id is not provided");
    if (!created_date) throw Error("Created date must be provided");
    if (!user_id) throw Error("user_id must be provided");
    if (!school_id) throw Error("school_id must be provided");

    const column_based_on_user_type = user_type === user_type_variable.TEACHER ? homework_table.TEACHER_ID : homework_table.ADMIN_ID; 
    const query = `INSERT INTO homework_assignment (${column_based_on_user_type}, ${homework_table.SCHOOL_ID}, ${homework_table.CLASS_ID}, ${homework_table.TITLE}, ${homework_table.DESCRIPTION}, ${homework_table.CREATED_BY}, ${homework_table.CREATED_DATE}) 
    VALUES ($1, $2, $3, $4, $5, $6, $7)RETURNING *, '${user_id}' AS requesting_user_id, '${user_type}' AS requesting_user_type`;
    const insertedHomework = await db.query(query, [ user_id, school_id, class_id, title, description, user_id, created_date]);
    res.status(200).json(insertedHomework.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getHomeworkByClassIdAndDate = async (req, res) => {
    try {
        const { class_id, created_date } = req.params;
        const { user_id, school_id, user_type } = req?.user;
        // console.log("req===>", req);
        if (!class_id) throw Error("class_id is not provided");
        if (!created_date) throw Error("Created date must be provided");
        if (!user_id) throw Error("user_id must be provided");
        if (!school_id) throw Error("school_id must be provided");
    
        const query = `
          SELECT
            ha.id,
            ha.teacher_id,
            ha.admin_id,
            ha.class_id,
            ha.title,
            ha.description,
            ha.created_by,
            TO_CHAR(ha.created_date, 'YYYY-MM-DD') AS created_date,
            ha.created_on,
            COALESCE(ua.username, t.first_name) AS creator_name,
            '${user_id}' AS requesting_user_id,
            '${user_type}' AS requesting_user_type
        FROM
            homework_assignment ha
        LEFT JOIN
            users ua ON ha.admin_id = ua.user_id AND ua.user_type = 'admin'
        LEFT JOIN
            teacher t ON ha.teacher_id = t.teacher_id
        WHERE ha.${homework_table.CLASS_ID} = '${class_id}' 
        AND ha.${homework_table.CREATED_DATE} = '${created_date}'::date 
        AND ha.${homework_table.SCHOOL_ID} = '${school_id}'
        `;
        // console.log("query===> class_id, created_date, school_id==>", query);
        const insertedHomework = await db.query(query, [ ]);
        res.status(200).json(insertedHomework.rows);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
}

const getHomeworkByClassIdForStudent = async (req, res) => {
    try {
        const { created_date } = req.params;
        const { user_id, school_id } = req?.user;
        const student = await getStudentObjByStudentId(user_id);
        const class_id = student?.[student_table?.CLASS_ID];
        console.log("created_date", class_id);

        if (!class_id) throw Error("couldn't find your class_id");
        if (!created_date) throw Error("Created date must be provided");
        if (!user_id) throw Error("user_id must be provided");
        if (!school_id) throw Error("school_id must be provided");
    
        const query = `SELECT 
            id, ${homework_table.TEACHER_ID}, ${homework_table.CLASS_ID}, ${homework_table.TITLE}, ${homework_table.DESCRIPTION}, ${homework_table.CREATED_BY},
            TO_CHAR(${homework_table.CREATED_DATE}, 'YYYY-MM-DD') AS ${homework_table.CREATED_DATE},
            ${homework_table.CREATED_ON}
            FROM homework_assignment
            WHERE ${homework_table.CLASS_ID} = $1 AND ${homework_table.CREATED_DATE} = $2::date AND ${homework_table.SCHOOL_ID} = $3`;
        const insertedHomework = await db.query(query, [ class_id, created_date, school_id]);
        res.status(200).json(insertedHomework.rows);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
}


const updateHomework = async (req, res) => {
    try {
      const { title, description } = req.body;
      const { user_id, school_id, user_type } = req?.user;
      const { id } = req.params;
  
      if (!title) throw Error("title is not provided");
      if (!description) throw Error("description is not provided");
      if (!user_id) throw Error("user_id must be provided");
      if (!school_id) throw Error("school_id must be provided");
      if (!id) throw Error("asignment id must be provided");
  
      const query = `UPDATE homework_assignment SET ${homework_table.TITLE} = $1, ${homework_table.DESCRIPTION} = $2 WHERE id=$3 
      RETURNING *, '${user_id}' AS requesting_user_id, '${user_type}' AS requesting_user_type`;
      const updatedHomework = await db.query(query, [ title, description, id]);
      res.status(200).json(updatedHomework.rows[0]);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
};

const deleteHomeworkById = async (req, res) => {
    try{
      const { id } = req.params;
      const { user_id, school_id } = req?.user;
      if(!id) throw Error("Class id is not provided");
      if (!user_id) throw Error("user_id must be provided");
      if (!school_id) throw Error("school_id must be provided");
      const deleteHomework = `DELETE FROM homework_assignment WHERE id = $1 RETURNING *`;
      const deleteHomeworkResponse = await db.query(deleteHomework, [id]);
      res.status(200).json(deleteHomeworkResponse.rows[0]);
    }catch(error){
      res.status(400).json({ error: error.message });
    }
  }


module.exports = {
  saveHomework,
  getHomeworkByClassIdAndDate,
  updateHomework,
  deleteHomeworkById,
  getHomeworkByClassIdForStudent
};
