// create projectManagerApp express mini application
const express = require("express");
const projectManagerApp = express.Router();

// import controllers
const {
  projectUpdate,
  raiseProjectConcern,
  getProjectsForProjectManager,
  getSpecificProjectDetails,
  updateProjectUpdates,
  deleteProjectUpdates,
  updateProjectConcerns,
  deleteProjectConcerns,
} = require("../controllers/projectManager.controller");

// import projectManagerVerifyToken
const verifyProjectManagerToken = require("../middlewares/verifyProjectManagerToken");

// Routes for projectManager

// projectUpdates added by projectManager
projectManagerApp.post(
  "/projectManager/projectUpdates/:projectId",
  verifyProjectManagerToken,
  projectUpdate
);

// Raise project concerns by project Manager
projectManagerApp.post(
  "/projectManager/projectConcern",
  verifyProjectManagerToken,
  raiseProjectConcern
);

// get all the projects maintained by projectManager
projectManagerApp.get(
  "/projectManager/portfolioDashboard",
  verifyProjectManagerToken,
  getProjectsForProjectManager
);

// update the project updates
projectManagerApp.put(
  "/projectManager/projectUpdates/:id",
  verifyProjectManagerToken,
  updateProjectUpdates
);

// get the indetail details for specific project
projectManagerApp.get(
  "/projectManager/portfolioDashboard/:projectId",
  verifyProjectManagerToken,
  getSpecificProjectDetails
);

// delete project updates
projectManagerApp.delete(
  "/projectManager/projectUpdates/:id",
  verifyProjectManagerToken,
  deleteProjectUpdates
);

// update the project concerns
projectManagerApp.put(
  "/projectManager/projectConcern/:id",
  verifyProjectManagerToken,
  updateProjectConcerns
);

// delete project concerns
projectManagerApp.delete(
  "/projectManager/projectConcern/:id",
  deleteProjectConcerns
);

// exports
module.exports = projectManagerApp;
