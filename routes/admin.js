const express = require('express');
const router = express.Router();
const admin_table = require('../constants/admin_table.js');
const { createAdminAPI,
  getAdminByAdminIdAPI,
  updateAdminByIdAPI,
  deleteAdminByAdminIdAPI,
  getAllAdminsBySchoolIdAPI,
  createAdminUserByAdminIdAPI
} = require('../controllers/adminController.js');

router.post(`/`, createAdminAPI);
router.get(`/${admin_table?.ADMIN_ID}`, getAdminByAdminIdAPI);
router.put(`/`, updateAdminByIdAPI);
router.delete(`/:${admin_table?.ADMIN_ID}`, deleteAdminByAdminIdAPI);
router.get(`/school/:${admin_table.SCHOOL_ID}`, getAllAdminsBySchoolIdAPI);
router.get(`/create_user/:${admin_table?.ADMIN_ID}`, createAdminUserByAdminIdAPI);

module.exports = router;