const db = require("../db");


const getSessionYearList = async () => {
  const getSessionQuery = `SELECT * FORM session_year`;
  const getSessionResponse = await db.query(getSessionQuery);
  return getSessionResponse?.rows
}

module.exports = {
  getSessionYearList
}