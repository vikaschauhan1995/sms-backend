const homework_table = require("../constants/homework_table");
const db = require("../db");

const saveHomework = async (req, res) => {
  try {
    const { title, description, class_id, created_date } = req.body;
    const { user_id, school_id } = req?.user;

    if (!title) throw Error("title is not provided");
    if (!description) throw Error("description is not provided");
    if (!class_id) throw Error("class_id is not provided");
    if (!created_date) throw Error("Created date must be provided");
    if (!user_id) throw Error("user_id must be provided");
    if (!school_id) throw Error("school_id must be provided");

    const query = `INSERT INTO homework_assignment (${homework_table.TEACHER_ID}, ${homework_table.SCHOOL_ID}, ${homework_table.CLASS_ID}, ${homework_table.TITLE}, ${homework_table.DESCRIPTION}, ${homework_table.CREATED_BY}, ${homework_table.CREATED_DATE}) 
    VALUES ($1, $2, $3, $4, $5, $6, $7)RETURNING *`;
    const insertedHomework = await db.query(query, [ user_id, school_id, class_id, title, description, user_id, created_date]);
    res.status(200).json(insertedHomework.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getHomeworkByClassIdAndDate = async (req, res) => {
    try {
        const { class_id, created_date } = req.params;
        const { user_id, school_id } = req?.user;
    
        if (!class_id) throw Error("class_id is not provided");
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
        console.log("query=>", query);
        res.status(200).json(insertedHomework.rows);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
}


const updateHomework = async (req, res) => {
    try {
      const { title, description } = req.body;
      const { user_id, school_id } = req?.user;
      const { id } = req.params;
  
      if (!title) throw Error("title is not provided");
      if (!description) throw Error("description is not provided");
      if (!user_id) throw Error("user_id must be provided");
      if (!school_id) throw Error("school_id must be provided");
      if (!id) throw Error("asignment id must be provided");
  
      const query = `UPDATE homework_assignment SET ${homework_table.TITLE} = $1, ${homework_table.DESCRIPTION} = $2 WHERE id=$3 RETURNING *`;
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
  deleteHomeworkById
};
