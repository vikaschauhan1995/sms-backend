const { v4: uuidv4 } = require('uuid');
const users = require('../constants/users_table');

const db = require('../db');
const validateEmail = require('../utility/validateEmail');
const validateUsername = require('../utility/validateUsername');
const createOTPVarification = require('../methods/createOTPVarification');
const createTokenForObject = require('../methods/createTokenForObject');
const sendMail = require('../methods/sendMail');
const { CREATE_USER } = require('../constants/verification_table');
const users_table = require('../constants/users_table');
const admin_table = require('../constants/admin_table');
const { createAdmin } = require('../methods/admin_methods/createAdmin');
const { getAdminByAdminId } = require('../methods/admin_methods/getAdminByAdminId');
const { updateAdminById } = require('../methods/admin_methods/updateAdminById');
const { deleteAdminByAdminId } = require('../methods/admin_methods/deleteAdminByAdminId');
const { getAllAdminsBySchoolId } = require('../methods/admin_methods/getAllAdminsBySchoolId');


const createAdminAPI = async (req, res) => {
  try {
    const { school_id, name, email, mobile_number, address } = req?.body;
    const { user_id: created_by } = req?.user;
    const createdAdmin = await createAdmin(school_id, name, email, mobile_number, address, created_by);
    res.status(200).json(createdAdmin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const getAdminByAdminIdAPI = async (req, res) => {
  try {
    const { admin_id } = req?.params;
    const admin = await getAdminByAdminId(admin_id);
    res.status(200).json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const updateAdminByIdAPI = async (req, res) => {
  try {
    const { admin_id, name, email, mobile_number, address } = req?.body;
    const updatedAdmin = updateAdminById(admin_id, name, email, mobile_number, address);
    res.status(200).json(updatedAdmin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

const deleteAdminByAdminIdAPI = async (req, res) => {
  try{
    const { admin_id } = req?.params;
    const deletedAdmin = await deleteAdminByAdminId(admin_id);
    res.status(200).json(deletedAdmin);
  }catch(error){
    res.status(400).json({ error: error.message });
  }
}

const getAllAdminsBySchoolIdAPI = async (req, res) => {
  try{
    const { school_id } = req?.params;
    const admins = await getAllAdminsBySchoolId(school_id);
    res.status(200).json(admins);
  }catch(error){
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  createAdminAPI,
  getAdminByAdminIdAPI,
  updateAdminByIdAPI,
  deleteAdminByAdminIdAPI,
  getAllAdminsBySchoolIdAPI
}