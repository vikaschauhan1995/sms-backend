const db = require("../../db");

const getSessionYearList = async () => {
  try {
    const getSessionQuery = `SELECT * FROM session_year`;
    const getSessionResponse = await db.query(getSessionQuery);
    return getSessionResponse?.rows;
  } catch (error) {
    throw Error(error.message);
  }
};

module.exports = {
  getSessionYearList,
};
