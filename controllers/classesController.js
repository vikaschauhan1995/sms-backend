const db = require("../db");
const classes_table = require("../constants/classes_table")
const { getSchoolBySchoolId } = require('./schoolController.js');
const { getClassListBySchoolId } = require("../methods/classes_methods/getClassListBySchoolId.js");

const getClassById = async (id) => {
  if(!id) throw Error("Class Id is required");
  const selectClass = `SELECT * FROM classes WHERE id = $1 LIMIT 1`;
  const selectClassResponse = await db.query(selectClass, [id]);
  return selectClassResponse?.rows[0];
}

const getClassByIdAndCreatedBy = async (id, created_by) => {
  if(!id) throw Error("Class Id is required");
  const selectClass = `SELECT * FROM classes WHERE id = $1 AND created_by = $2 LIMIT 1`;
  const selectClassResponse = await db.query(selectClass, [id, created_by]);
  return selectClassResponse?.rows[0];
}

const saveClass = async (req, res) => {
  try {
    const { school_id, created_by, class_name, section, created_year } = req.body;
    if (!school_id) throw Error("school id is not provided");
    if (!created_by) throw Error("created_by is not provided");
    if (!created_year) throw Error("created_year is not provided");
    if (!class_name || !section) throw Error("All fields must not be empty");
    const saveClass = `INSERT INTO classes (${classes_table?.SCHOOL_ID}, ${classes_table?.CREATED_BY}, ${classes_table?.CLASS_NAME}, ${classes_table?.SECTION}, ${classes_table?.CREATED_YEAR}) VALUES($1, $2, $3, $4, $5) RETURNING *`;
    const saveClassResponse = await db.query(saveClass, [school_id, created_by, class_name, section, created_year]);
    res.status(200).json(saveClassResponse.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { class_name, section } = req.body;
    if (!id) throw Error("Class id is not provided");
    if (!class_name || !section) throw Error("All fields must not be empty");
    const oldClass = await getClassById(id);
    if (!oldClass) throw Error("Class id is not valid");
    const updateClass = `UPDATE classes SET ${classes_table?.CLASS_NAME} = $1, ${classes_table?.SECTION} = $2 WHERE id=$3 RETURNING *`;
    const updateClassResponse = await db.query(updateClass, [class_name, section, id]);
    res.status(200).json(updateClassResponse?.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const getAllClassesBySchoolIdAndCreatedYear = async (req, res) => {
  try{
    const { school_id, created_year } = req.params;
    if(!school_id) throw Error("School id is not provided");
    if(!created_year) throw Error("Created year is not provided");
    const oldSchool = await getSchoolBySchoolId(school_id);
    if(!oldSchool) throw Error("School id is not valid");
    const getClasses = `SELECT * FROM classes WHERE ${classes_table?.SCHOOL_ID} = $1 AND ${classes_table?.CREATED_YEAR} = $2 ORDER BY id DESC`;
    const getClassesResponse = await db.query(getClasses, [school_id, created_year]);
    res.status(200).json(getClassesResponse.rows);
  }catch(error){
    res.status(400).json({ error: error.message });
  }
}

const deleteClassByClassId = async (req, res) => {
  try{
    const { id } = req.params;
    if(!id) throw Error("Class id is not provided");
    const class_ = await getClassById(id);
    if(!class_) throw Error("Class id is not valid")
    const deleteClass = `DELETE FROM classes WHERE id = $1 RETURNING *`;
    const deleteClassResponse = await db.query(deleteClass, [id]);
    res.status(200).json(deleteClassResponse.rows[0]);
  }catch(error){
    res.status(400).json({ error: error.message });
  }
}

const getClass = async (req, res) => {
  try{
    const { id } = req.params;
    if(!id) throw Error("Class id is not provided");
    const class_ = await getClassById(id);
    if(!class_) throw Error("Class id is not valid");
    res.status(200).json(class_);
  }catch(error){
    res.status(400).json({ error: error.message });
  }
}

const getClassList = async (req, res) => {
  try{
    const { user_id, school_id } = req?.user;
    const classList = await getClassListBySchoolId(school_id);
    res.status(200).json(classList);
  }catch(error){
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  saveClass,
  updateClass,
  getAllClassesBySchoolIdAndCreatedYear,
  deleteClassByClassId,
  getClass,
  getClassById,
  getClassByIdAndCreatedBy,
  getClassList
}