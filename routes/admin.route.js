// create admin mini express application
const express = require("express");
const adminApp = express.Router();

// import verifyAdminToken
const verifyAdminToken = require("../middlewares/verifyAdminToken");

// import admin controllers
const {
  getProjects,
  getSpecificProjectDetails,
  createProject,
  updateProject,
  deleteProject,
  getAllResourceRequests,
} = require("../controllers/admin.controller");

// routes for admin after login

// get all projects on clicking portfolioDashboard
adminApp.get("/admin/portfolioDashboard", verifyAdminToken, getProjects);

// get specific project details by clicking on specific project
adminApp.get(
  "/admin/portfolioDashboard/:projectId",
  verifyAdminToken,
  getSpecificProjectDetails
);

// create project
adminApp.post("/admin/project", verifyAdminToken, createProject);

// update the existing project by admin
adminApp.put(
  "/admin/portfolioDashboard/project/:projectId",
  verifyAdminToken,
  updateProject
);

// delete the existing project by admin
adminApp.delete(
  "/admin/portfolioDashboard/project/:projectId",
  verifyAdminToken,
  deleteProject
);

// get the resource requests
adminApp.get("/admin/resourceRequest", verifyAdminToken,getAllResourceRequests);

// export adminApi
module.exports = adminApp;
