const Joi = require("joi");
const { UnauthorizedError } = require("../../errorHandler/errorHandler");
const usersModel = require("../users.model");
const jwt = require("jsonwebtoken");

function prepareReturnUserData(users = []) {
  const newUserListData = users.map((user) => {
    const { email, username, verify, todoListIds, token } = user;
    console.log(user);

    return {
      email,
      username,
      verify,
      todoListIds,
    };
  });
  return newUserListData;
}

function userDataValidation(req, res, next) {
  const validationSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  const userData = req.body;

  const validationResult = validationSchema.validate(userData);

  if (validationResult.error) {
    return res.status(400).send({ message: validationResult.error });
  }

  next();
}

async function userAuthorization(req, res, next) {
  try {
    let token = null;
    try {
      const authorizationHeader = req.get("Authorization");
      token = authorizationHeader.replace("Bearer ", "");
    } catch (error) {
      next(new UnauthorizedError({ message: "correct authorization Header" }));
    }

    let userId = null;
    try {
      userId = jwt.verify(token, process.env.JWT_SECRET).id;
    } catch (error) {
      next(new UnauthorizedError({ message: "Not authorized" }));
    }

    const user = await usersModel.findById(userId);

    if (!user || user.token !== token) {
      next(new UnauthorizedError({ message: "Not authorized" }));
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  prepareReturnUserData,
  userDataValidation,
  userAuthorization,
};
