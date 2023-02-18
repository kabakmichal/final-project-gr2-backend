const express = require("express");
const usersController = require("./users.controllers.js");
const router = express.Router();

router.post(
  "/register",
  usersController.userDataValidation,
  usersController.userRegistration
);

router.get("/verify/:verificationToken", usersController.verifyEmail);

module.exports = router;
