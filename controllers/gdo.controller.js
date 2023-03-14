// import expressAsyncHandler
const expressAsyncHandler = require("express-async-handler");

// import TeamCompostion Model
const { TeamComposition } = require("../models/teamComposition.model");

// import project Model
const { Project } = require("../models/project.model");

// import ResourcingRequest model
const { ResourcingRequest } = require("../models/resourcingRequest.model");

const { Op } = require("sequelize");

// Assigning projects
const assignProject = expressAsyncHandler(async (req, res) => {
  // insert the data into the Team Composition model
  await TeamComposition.bulkCreate(req.body.employeeprojectdetails);
  res.status(201).send({ message: "Project assigned to Employee" });
});

// rasieResourcingRequest
const rasieResourcingRequest = expressAsyncHandler(async (req, res) => {
  // insert the data into resourcingRequest model
  await ResourcingRequest.create(req.body);
  res.status(201).send({ message: "resourcing request raised" });
});

// get all the projects under his maintance
const getProjects = expressAsyncHandler(async (req, res) => {
  // get the gdoId from url
  let gdoIdFromUrl = req.params.gdoId;
  console.log("user Id is :-", req.userId);
  // query to find all the projects for the gdoId
  let projectRecord = await Project.findAll({
    where: {
      gdoId: req.userId,
      status: true,
    },
    attributes: {
      exclude: [
        "gdoId",
        "projectManager",
        "hrManager",
        "domain",
        "typeOfProject",
      ],
    },
  });
  // if there are no projects for gdo
  if (projectRecord.length == 0) {
    res.status(204).send({ message: "sorry No projects for You..." });
  }
  // if there are projects
  else {
    res.status(200).send({
      message: `All Projects for gdo ${gdoIdFromUrl}`,
      payload: projectRecord,
    });
  }
});

// get specificProjectDetails
const getSpecificProjectDetails = expressAsyncHandler(async (req, res) => {
  // get the projectId from url
  let projectIdFromUrl = req.params.projectId;
  let gdoIdFromUrl = req.params.gdoId;

  // query to get the particular projectId and its project updates and project concerns by associations
  let projectRecord = await Project.findOne({
    where: {
      projectId: projectIdFromUrl,
      gdoId: req.userId,
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

  if (projectRecord != undefined) {
    // retrieveing the project updates only before 2 weeks
    let today = new Date();
    let dateBeforeTwoWeeks = new Date();
    dateBeforeTwoWeeks.setDate(today.getDate() - 14);

    let projectUpdatedBeforeTwoWeeks = await projectRecord.getProjectUpdates({
      where: {
        date: {
          [Op.between]: [dateBeforeTwoWeeks, today],
        },
      },
    });

    // return project fitness, concern indicator ,Team members get these values from projectRecord
    let projectFitness =
      projectRecord.dataValues.overAllProjectFitnessIndicator;

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
  } else {
    res.status(204).send({ message: "project not found" });
  }
});

// update employee details in team
const updateEmployeeDetailsInProject = expressAsyncHandler(async (req, res) => {
  // query to update the employee details
  await TeamComposition.update(req.body, {
    where: {
      empId: req.body.empId,
    },
  });
  res.status(200).send({ message: "Employee Updated" });
});

// deletEmployeeFromProject
const deletEmployeeFromProject = expressAsyncHandler(async (req, res) => {
  // query to delete the employee from project
  await TeamComposition.destroy({
    where: {
      empId: req.params.empId,
      projectId: req.params.projectId,
    },
  });
  res.status(200).send({ message: "Employee deleted from the project" });
});

// exports
module.exports = {
  assignProject,
  rasieResourcingRequest,
  getProjects,
  getSpecificProjectDetails,
  updateEmployeeDetailsInProject,
  deletEmployeeFromProject,
};
