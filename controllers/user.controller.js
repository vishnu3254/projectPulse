// import expressAsyncHandler
const expressAsyncHandler = require("express-async-handler");

//import nodemailer
const nodemailer = require("nodemailer");

// import bcryptjs
const bcryptjs = require("bcryptjs");

// import jwt
const jwt = require("jsonwebtoken");

//create connection to smtp
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE_PROVIDER,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD, // app password
  },
});

// In Data memory to store the otp's
let otps = {};

// import Employee Model
const { Employee } = require("../models/employee.model");

// import user model
const { User } = require("../models/user.model");

const registerUser = expressAsyncHandler(async (req, res) => {
  // get the body from request
  let { userId, email, username, password } = req.body;

  // check the user is existed in our company database or not
  let userExistenceInWal = await Employee.findOne({
    where: {
      empId: userId,
    },
  });

  // if the user is not existed in our company then restrict the resgitration process
  if (userExistenceInWal == undefined) {
    res.status(401).send({
      message: "Unauthorized access You are not belongs to this company",
    });
  }

  // if the user existed in company database
  else {
    // check if the employee already exists with that email
    let userRecord = await User.findOne({
      where: {
        email: email,
      },
    });

    // if user found already
    if (userRecord != undefined) {
      res.status(200).send({ message: "User already found with that email" });
    }

    // if user not exists insert the data into the database
    else {
      // hash the password
      let hashedPassword = await bcryptjs.hash(password, 6);
      req.body.password = hashedPassword;
      await User.create(req.body);
      res.status(201).send({ message: "User Registered" });
    }
  }
});

// user Login
const loginUser = expressAsyncHandler(async (req, res) => {
  // get the userId and password from body
  let { userId, password } = req.body;
  // check the user existence using userId
  let userRecord = await User.findOne({
    where: {
      userId: userId,
    },
  });
  // if user not found
  if (userRecord == undefined) {
    res.status(404).send({ message: `User not found with id ${userId}` });
  }
  // if user found check password
  else {
    let checkPassword = await bcryptjs.compare(
      password,
      userRecord.dataValues.password
    );
    // if password not matched
    if (!checkPassword) {
      res.status(401).send({ message: "Incorrect password" });
    } else {
      // create a jwt token
      let signedToken = jwt.sign(
        {
          userId: userRecord.dataValues.userId,
          userRole: userRecord.dataValues.role,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "10d",
        }
      );
      // delete the password in userRecord object while displaying the object
      delete userRecord.dataValues.password;
      res.status(200).send({
        message: "Login successfull",
        payload: signedToken,
        user: userRecord,
      });
    }
  }
});

// forgot password
const forgotPassword = expressAsyncHandler(async (req, res) => {
  // generate random number with 6 digits as otp
  let otp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
  console.log(otp);
  otps[req.body.email] = otp;
  console.log(req.body.email);
  // defining mail options
  let mailOptions = {
    from: "vv50285@gmail.com",
    to: req.body.email,
    subject: "OTP to reset password for project pulse",
    text:
      `Hi ,
     We received a request to reset yout project pulse password .Enter the following OTP to reset password :  
      ` + otp,
  };

  // send email
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log("err");
    } else {
      console.log("email sent", info.messageId);
    }
  });

  //setting validity to OTP for 10min
  // setTimeout(() => {
  //   //delete OTP from object
  //   delete otps[req.body.email];
  // }, 600000000);

  res.status(200).send({ message: "Otp is sent to your email..." });
});

// reset password
const resetPassword = expressAsyncHandler(async (req, res) => {
  // checking if the otp is valid
  //otp matches
  if (req.body.otp == otps[req.params.email]) {
    console.log("password verififed");
    let hashedPassword = await bcryptjs.hash(req.body.password, 6);
    console.log("email", req.params.email);
    let updatedCount = await User.update(
      { password: hashedPassword },
      {
        where: {
          email: req.params.email,
        },
      }
    );
    console.log(updatedCount);
    res.status(200).send({ message: "Password reset sucessfully" });
  }
  // else
  else {
    res.status(401).send({ message: "Invalid OTP" });
  }
});

// export controllers
module.exports = { registerUser, loginUser, forgotPassword, resetPassword };
