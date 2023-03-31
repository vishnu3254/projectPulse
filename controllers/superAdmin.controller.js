// import expressAsyncHandler
const expressAsyncHandler = require("express-async-handler");

// import user controller
const { User } = require("../models/user.model");

//role mapping
const roleMapping = expressAsyncHandler(async (req, res) => {
  // get the role and userId
  let { userId, role } = req.body;

  // check the user existence
  let userRecord = await User.findOne({
    where: {
      userId: userId,
    },
    attributes: {
      exclude: ["password"],
    },
  });

  // if userRecord is empty means no user found
  if (userRecord == undefined) {
    res.status(404).send({ message: "User not found to assign the role" });
  }

  // if user found
  else {
    console.log("in Update role");
    let updatedUserRecord = await User.update(req.body, {
      where: {
        userId: userId,
      },
    });
    res
      .status(200)
      .send({ data: userRecord, message: `Role is mapped to id ${userId}` });
  }
});

// get All users
const getAllUsers = expressAsyncHandler(async (req, res) => {
  let userRecords = await User.findAll({
    attributes: {
      exclude: ["password"],
    },
  });
  res.status(200).send({ message: "All users", payload: userRecords });
});

// dlete user
const deleteUser = expressAsyncHandler(async (req, res) => {
  // get the data from url params
  let userIdFromUrl = req.params.userId;

  await User.destroy({
    where: {
      userId: userIdFromUrl,
    },
  });
  res.send({ message: "User deleted Successfully" });
});

// exports
module.exports = { roleMapping, getAllUsers, deleteUser };
