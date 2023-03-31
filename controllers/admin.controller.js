// import expressAsyncHandler
const expressAsyncHandler = require("express-async-handler");

// import moment
const moment = require("moment");

// import Project model
const { Project } = require("../models/project.model");

// import projectUpdatesModel
const { ProjectUpdates } = require("../models/projectUpdates.model");

// import projectconcern Model
const { ProjectConcern } = require("../models/projectConcerns.model");

// import Team composition model
const { TeamComposition } = require("../models/teamComposition.model");

// improt ResourcingRequest model
const { ResourcingRequest } = require("../models/resourcingRequest.model");

const { Op } = require("sequelize");

// Association between Project and ProjectUpdates (one-to-many)
Project.ProjectUpdates = Project.hasMany(ProjectUpdates, {
  foreignKey: "projectId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Association between Project and Project Concern (one-to-many)
Project.ProjectConcern = Project.hasMany(ProjectConcern, {
  foreignKey: "projectId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Association between project and team composition model (one-to-many)
Project.TeamComposition = Project.hasMany(TeamComposition, {
  foreignKey: "projectId",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// create project by admin
const createProject = expressAsyncHandler(async (req, res) => {
  // insert the data from body to project model
  await Project.create(req.body);
  res.status(201).send({ message: "Project Created" });
});

// get projects by admin
const getProjects = expressAsyncHandler(async (req, res) => {
  let projects = await Project.findAll({
    where: {
      status: true,
    },
    attributes: {
      exclude: [
        // "gdoId",
        // "projectManager",
        // "hrManager",
        // "domain",
        // "typeOfProject",
        // "status",
      ],
    },
  });
  // if there are no projects
  if (projects.length == 0) {
    res.status(200).send({ message: "No Projects Available" });
  }
  // if there are projects display them
  else {
    res.status(200).send({ message: "All projects", payload: projects });
  }
});

// get specificProjectDetails
const getSpecificProjectDetails = expressAsyncHandler(async (req, res) => {
  // get the projectId from url
  let projectIdFromUrl = req.params.projectId;

  // query to get the particular projectId and its project updates and project concerns by associations
  let projectRecord = await Project.findOne({
    where: {
      projectId: projectIdFromUrl,
      status: true,
    },

    include: [
      {
        association: Project.ProjectConcern,
      },
      {
        association: Project.TeamComposition,
      },
    ],
  });

  // retrieveing the project updates only before 2 weeks
  let today = new Date();
  let dateBeforeTwoWeeks = new Date();
  dateBeforeTwoWeeks.setDate(today.getDate() - 14);
<<<<<<< testing

>>>>>>> master
  // getProjectUpdates means get Assocaiton using lazy loading
  let projectUpdatedBeforeTwoWeeks = await projectRecord.getProjectUpdates({
    where: {
      date: {
        [Op.between]: [dateBeforeTwoWeeks, today],
      },
    },
  });

  // return project fitness, concern indicator ,Team members get these values from projectRecord
  let projectFitness = projectRecord.dataValues.overAllProjectFitnessIndicator;

  // find team size
  let teamSize = projectRecord.dataValues.employeeProjectDetails.length;

  // find number of concerns is active
  let concernIndicator = 0;
  projectRecord.dataValues.projectConcerns.forEach((concern) => {
    if (concern.statusOfConcern == "pending") concernIndicator++;
  });

  // send response
  res.status(200).send({
    message: `Project Detaitls for projectId ${projectIdFromUrl}`,
    projectFitness: projectFitness,
    teamSize: teamSize,
    concernIndicator: concernIndicator,
    payload: projectRecord,
    projectUpdates: projectUpdatedBeforeTwoWeeks,
  });
});

// update existing project
const updateProject = expressAsyncHandler(async (req, res) => {
  //  query to update
  let updatedRecord = await Project.update(req.body, {
    where: {
      projectId: req.body.projectId,
    },
  });
  // check if project is updated correctly or not
  if (updatedRecord == 0) {
    res.status(304).send({ message: "Project not updated.." });
  } else {
    res.status(200).send({ message: "Project Updated.." });
  }
});

// Delete project (soft delete)
const deleteProject = expressAsyncHandler(async (req, res) => {
  // update the status for performing soft delete
  await Project.update(
    { status: false },
    {
      where: {
        projectId: req.params.projectId,
      },
    }
  );

  res.send({ message: "project is deleted" });
});

// getAllResourceRequests
const getAllResourceRequests = expressAsyncHandler(async (req, res) => {
  // query to get the resource data
  let resouceRequestRecords = await ResourcingRequest.findAll({
    where: {
      projectId: req.params.projectId,
    },
  });
  res.status(200).send({
    message: "All Resource requests",
    payload: resouceRequestRecords,
  });
});

// export controllers
module.exports = {
  getProjects,
  getSpecificProjectDetails,
  createProject,
  updateProject,
  deleteProject,
  getAllResourceRequests,
};
