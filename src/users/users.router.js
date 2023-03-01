const express = require("express");
const usersControllerRegistration = require("./users.controllers/users.controllers.registration.js");
const usersControllerAuthentication = require("./users.controllers/users.controllers.authentication.js");
const router = express.Router();

const {
  userDataRegistrationValidation,
  userAuthorization,
  userDataAuthorizationValidation,
} = require("./users.controllers/users.controllers.common.js");

router.post(
  "/register",
  userDataRegistrationValidation,
  usersControllerRegistration.userRegistration
);

router.get(
  "/verify/:verificationToken",
  usersControllerRegistration.verifyEmail
);

router.put(
  "/login",
  userDataAuthorizationValidation,
  usersControllerAuthentication.userLogIn
);

router.put(
  "/logout",
  userAuthorization,
  usersControllerAuthentication.userLogout
);

module.exports = router;
