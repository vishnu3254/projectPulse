// import expressAsyncHandler
const expressAsyncHandler = require("express-async-handler");

//import nodemailer module
const nodemailer = require("nodemailer");

// dotenv
require("dotenv").config();

// import Project Model
const { Project } = require("../models/project.model");

// import projectUpdatesModel
const { ProjectUpdates } = require("../models/projectUpdates.model");

// import projectconcerns model
const { ProjectConcern } = require("../models/projectConcerns.model");

// import TeamComposition model
const { TeamComposition } = require("../models/teamComposition.model");

const { Op } = require("sequelize");

// For email triggering we use nodemailer module

//create connection to smtp
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE_PROVIDER,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD, // app password
  },
});

// projectUpdates added by projectManager
const projectUpdate = expressAsyncHandler(async (req, res) => {
  // insert the data into projectupdates model
  await ProjectUpdates.create(req.body);
  res.status(201).send({ message: "ProjectUpdates created" });
});

// raise project concerns by project manager
const raiseProjectConcern = expressAsyncHandler(async (req, res) => {
  // insert data into project concern model
  await ProjectConcern.create(req.body);

  //mail options for nodemailer
  let mailOptions = {
    from: "vishnuvardhanudagundla7@gmail.com",
    to: "vv50285@gmail.com",
    subject: `Project concern is raised for project ${req.body.projectId} by ${req.body.projectManager}`,
    text: `Hi Admin,
     A project concern is raised 
     Concern Description: ${req.body.concernDescription}
     severity:${req.body.severity} `,
  };

  // send email
  //send email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  res.status(201).send({ message: "Project Concern Raised...." });
});

// getProjectsForProjectManager
const getProjectsForProjectManager = expressAsyncHandler(async (req, res) => {
  // query to find all the projects under his maintanance
  let projectRecords = await Project.findAll({
    where: {
      // get the projectManagerId from request
      projectManager: req.userId,
      status: true,
    },
    attributes: {
      exclude: [
        "projectId",
        "gdoId",
        "projectManager",
        "hrManager",
        "domain",
        "typeOfProject",
      ],
    },
  });
  // if theere are no projects for projectManager
  if (projectRecords.length == 0) {
    res.status(204).send({ message: "Sorry You don't have any  projects" });
  }
  // if there are projects
  else {
    res.status(200).send({
      message: `All projects for ${projectManagerIdFromUrl}`,
      payload: projectRecords,
    });
  }
});

//getSpecificProjectDetails
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

  // if there are no projectRecord is not found
  if (projectRecord != undefined) {
    // retrieveing the project updates only before 2 weeks
    let today = new Date();
    let dateBeforeTwoWeeks = new Date();
    dateBeforeTwoWeeks.setDate(today.getDate() - 14);

    // lazy loading getProjectUpdates means get Association    
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
    res.status(204).send({ message: "Project not found" });
  }
});

// updateProjectUpdates
const updateProjectUpdates = expressAsyncHandler(async (req, res) => {
  // update query
  await ProjectUpdates.update(req.body, {
    where: {
      id: req.params.id,
    },
  });
  res.status(200).send({ message: "project update updated" });
});

// deleteProjectUpdates
const deleteProjectUpdates = expressAsyncHandler(async (req, res) => {
  // delete query to delete the project updates
  await ProjectUpdates.destroy({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).send({ message: "Project update deleted" });
});

// updateProjectConcerns
const updateProjectConcerns = expressAsyncHandler(async (req, res) => {
  // update query to update
  await ProjectConcern.update(req.body, {
    where: {
      id: req.params.id,
    },
  });
  res.status(200).send({ message: "Project concern is updated" });
});

// deleteProjectConcerns
const deleteProjectConcerns = expressAsyncHandler(async (req, res) => {
  // delete query to delete
  await ProjectConcern.destroy({
    where: {
      id: req.params.id,
    },
  });
  res.status(200).send({ message: "project concern deleted" });
});

// exports
module.exports = {
  projectUpdate,
  raiseProjectConcern,
  getProjectsForProjectManager,
  getSpecificProjectDetails,
  updateProjectUpdates,
  deleteProjectUpdates,
  updateProjectConcerns,
  deleteProjectConcerns,
};
