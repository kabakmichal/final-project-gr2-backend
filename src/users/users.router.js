const express = require("express");
const usersControllerRegistration = require("./users.controllers/users.controllers.registration.js");
const usersControllerAuthentication = require("./users.controllers/users.controllers.authentication.js");
const router = express.Router();

const {
  userDataValidation,
  userAuthorization,
} = require("./users.controllers/users.controllers.common.js");

router.post(
  "/register",
  userDataValidation,
  usersControllerRegistration.userRegistration
);

router.get(
  "/verify/:verificationToken",
  usersControllerRegistration.verifyEmail
);

router.put(
  "/login",
  userDataValidation,
  usersControllerAuthentication.userLogIn
);

router.put(
  "/logout",
  userAuthorization,
  usersControllerAuthentication.userLogout
);

module.exports = router;
