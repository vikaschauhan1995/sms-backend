const { getSessionYearList } = require("../methods/session_year_methods/getSessionYearList");



const getSessionYears = async (req, res) => {
  try{
    const sessionYears = await getSessionYearList();
    res.status(200).json(sessionYears);
  }catch(error){
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  getSessionYears
};