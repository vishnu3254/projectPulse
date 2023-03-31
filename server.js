// import express
const express = require("express");

// import helmet
const helmet = require("helmet")

// import cors
const cors = require("cors");

// create express obj application
const app = express();

app.use(helmet())

// cors
app.use(cors());
// dotenv
require("dotenv").config();

// import sequelize
const sequelize = require("./databases/db.config");

// import adminApp
const adminApp = require("./routes/admin.route");

// import userApp
const userApp = require("./routes/user.route");

// import superUserApp
const superAdminApp = require("./routes/superAdmin.route");

// import gdoApp
const gdoApp = require("./routes/gdo.route");

// import projectManagerApp
const projectManagerApp = require("./routes/projectManager.route");
const expressAsyncHandler = require("express-async-handler");
const { User } = require("./models/user.model");

// check sequelize connection
sequelize
  .authenticate()
  .then(() => console.log("DB CONNECTED..."))
  .catch((err) => console.log("DB FAILED..."));

// sync the sequelize
sequelize.sync();

// body parser
app.use(express.json());

// path middleware for superUser
app.use("/superAdmin-api", superAdminApp);

//path middleware for admin login
app.use("/admin-api", adminApp);

//path middleware for user
app.use("/user-api", userApp);

// path middleware for gdoApp
app.use("/gdo-api", gdoApp);

// path middleware for projectManager
app.use("/projectManager-api", projectManagerApp);

//get gdo details to display as select list while creating a project
app.get(
  "/gdo",
  expressAsyncHandler(async (req, res) => {
    let gdoRecord = await User.findAll({
      where: {
        role: "gdoHead",
      },
    });
    res.send({ message: "All GDO's", payload: gdoRecord });
  })
);

// get all projectManager details
app.get(
  "/projectManager",
  expressAsyncHandler(async (req, res) => {
    let projectManagerRecord = await User.findAll({
      where: {
        role: "projectManager",
      },
    });
    res.send({ message: "All project Manager", payload: projectManagerRecord });
  })
);

// get all hrManager details
app.get(
  "/hrManager",
  expressAsyncHandler(async (req, res) => {
    let hrManagerRecord = await User.findAll({
      where: {
        role: "hrManager",
      },
    });
    res.send({ message: "all Hr managers", payload: hrManagerRecord });
  })
);

//get employees for team composition
app.get(
  "/employees",
  expressAsyncHandler(async (req, res) => {
    let [employeeRecord] = await sequelize.query("select * from employees");
    res.send({ message: "All employees", payload: employeeRecord });
  })
);

// invalid path
app.use("*", (req, res) => {
  res.send({ message: "Invalid path" });
});
// error handling middleware
app.use((err, req, res, next) => {
  res.send({ message: err.message });
});

// import app
module.exports = app;
