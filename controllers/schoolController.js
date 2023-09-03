const { v4: uuidv4 } = require('uuid');
const school = require('../constants/school_table');
const db = require('../db');

const createSchool = async (req, res) => {
  const { school_name, mobile_number, address1, address2, state, pincode, country, expiration_date } = req.body;
  try {
    if (!school_name || !mobile_number || !address1 || !address2 || !state || !pincode || !country) {
      throw Error('All fields must be filled');
    }
    const school_id = uuidv4();
    const query = `INSERT INTO school (${school.SCHOOL_ID}, ${school.SCHOOL_NAME}, ${school.MOBILE_NUMBER}, ${school.ADDRESS1}, ${school.ADDRESS2}, ${school.STATE}, ${school.PINCODE}, ${school.COUNTRY}, ${school.EXPIRATION_DATE}) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`;
    await db.query(query, [school_id, school_name, mobile_number, address1, address2, state, pincode, country, expiration_date]);
    res.status(200).json({ message: 'School added successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

const getSchools = async (req, res) => {
  try {
    const query = `SELECT * FROM school`;
    const schools = await db.query(query);
    res.status(200).json(schools.rows);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

const getSchool = async (req, res) => {
  const { school_id } = req.params;
  try {
    const query = `SELECT * FROM school WHERE ${school.SCHOOL_ID} = $1`;
    console.log(query);
    const schoolObj = await db.query(query, [school_id]);
    res.status(200).json(schoolObj.rows);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

const updateSchool = async (req, res) => {
  const { school_name, mobile_number, address1, address2, state, pincode, country, expiration_date } = req.body;
  const { school_id } = req.params;
  try {
    const query = `UPDATE school SET 
      ${school.SCHOOL_NAME} = $1, 
      ${school.MOBILE_NUMBER} = $2, 
      ${school.ADDRESS1} = $3, 
      ${school.ADDRESS2} = $4, 
      ${school.STATE} = $5, 
      ${school.PINCODE} = $6, 
      ${school.COUNTRY} = $7, 
      ${school.EXPIRATION_DATE} = $8
      WHERE ${school.SCHOOL_ID} = $9 RETURNING *`;
    console.log(query);
    const newSchool = await db.query(query, [school_name, mobile_number, address1, address2, state, pincode, country, expiration_date, school_id]);
    res.status(200).json(newSchool.rows);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

const deleteSchool = async (req, res) => {
  const { school_id } = req.params;
  try {
    const query = `DELETE FROM school WHERE ${school.SCHOOL_ID} = $1 RETURNING *`;
    const deletedSchool = await db.query(query, [school_id]);
    res.status(200).json(deletedSchool.rows);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

module.exports = {
  createSchool,
  getSchools,
  getSchool,
  updateSchool,
  deleteSchool
};