//create superUserApp mini express application
const express = require("express");

const superAdminApp = express.Router();

// import verifySuperUserToken
const verifySuperAdminToken = require("../middlewares/verifySuperAdminToken");

// import controller
const {
  roleMapping,
  getAllUsers,
  deleteUser,
} = require("../controllers/superAdmin.controller");

// Routes for superUserApp

superAdminApp.put("/user/role", verifySuperAdminToken, roleMapping);

// get all users
superAdminApp.get("", verifySuperAdminToken, getAllUsers);

// delete user
superAdminApp.delete("/user/:userId", verifySuperAdminToken, deleteUser);

// export superUserApp
module.exports = superAdminApp;
