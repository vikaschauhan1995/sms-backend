const { v4: uuidv4 } = require('uuid');
const users = require('../constants/users_table');

const db = require('../db');
const { createUser } = require('./usersController');
const validateEmail = require('../utility/validateEmail');
const validateUsername = require('../utility/validateUsername');
const createOTPVarification = require('../methods/createOTPVarification');
const createTokenForObject = require('../methods/createTokenForObject');
const sendMail = require('../methods/sendMail');
const { CREATE_USER } = require('../constants/verification_table');
const users_table = require('../constants/users_table');


const createAdmin = async (req, res) => {
  try{
    
  }catch(error){

  }
}

module.exports = {
  createAdmin
}