// create gdoApp express mini application
const express = require("express");
const gdoApp = express.Router();

// import verifyGDOToken
const verifyGDOToken = require("../middlewares/verifyGDOToken");

// import controllers from gdo

const {
  assignProject,
  rasieResourcingRequest,
  getProjects,
  getSpecificProjectDetails,
  updateEmployeeDetailsInProject,
  deletEmployeeFromProject,
} = require("../controllers/gdo.controller");

// Routes for GDO

// Assign project to employees
gdoApp.post("/gdo/projectTeam", verifyGDOToken, assignProject);

// raise resourcing request by gdo
gdoApp.post("/gdo/resourcingRequest", verifyGDOToken, rasieResourcingRequest);

// get all projects under his maintanance
gdoApp.get("/:gdoId/portfolioDashboard", verifyGDOToken, getProjects);

// get specific project details
gdoApp.get(
  "/:gdoId/portfolioDashboard/:projectId",
  verifyGDOToken,
  getSpecificProjectDetails
);

// update particular team member by gdo
gdoApp.put(
  "/gdo/projectTeam/employee",
  verifyGDOToken,
  updateEmployeeDetailsInProject
);

// delete team member from the project
gdoApp.delete(
  "/gdo/projectTeam/employee/:empId",
  verifyGDOToken,
  deletEmployeeFromProject
);

// exports
module.exports = gdoApp;
