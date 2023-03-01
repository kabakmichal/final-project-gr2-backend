const usersModel = require("../users.model");
const bcryptjs = require("bcryptjs");
const { NotFound } = require("../../errorHandler/errorHandler");
const { v4 } = require("uuid");
const sgMail = require("@sendgrid/mail");
const path = require("path");

const { prepareReturnUserData } = require("./users.controllers.common");
const sendVerificationMail = require("../../helpers/sendGrid");

class UserControllerRegistration {
  constructor() {
    this._costFactor = 4;
    this._sgMail = sgMail;

    this._sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  get userRegistration() {
    return this._userRegistration.bind(this);
  }

  async _userRegistration(req, res, next) {
    try {
      const { password, email, username } = req.body;
      const isEmailUsed = await usersModel.findByEmail(email);

      if (isEmailUsed && isEmailUsed.length > 0) {
        return res
          .status(409)
          .json({ message: "Such email is already registered" });
      }

      const isUserNameUsed = await usersModel.findByUserName(username);

      if (isUserNameUsed && isUserNameUsed.length > 0) {
        return res
          .status(409)
          .json({ message: "Such username is already registered" });
      }

      const hashedPassword = await bcryptjs.hash(password, this._costFactor);
      const verificationToken = v4();

      const newUser = await usersModel.create({
        email: email,
        username: username,
        password: hashedPassword,
        verificationToken: verificationToken,
      });

      const response = await sendVerificationMail(
        email,
        username,
        verificationToken,
        process.env.TEMPLATE_ID,
        process.env.Send_Mail
      );

      if (response) {
        return res.status(500).json({
          responseMsg: response.message,
          serverMessage: "validation message failed",
        });
      }

      const [preparedUserData] = prepareReturnUserData([newUser]);

      return res.status(201).json({
        user: {
          ...preparedUserData,
        },
        message:
          "If you cannot find verification email, please check spam folder",
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req, res, next) {
    try {
      const { verificationToken } = req.params;

      const userToVerify = await usersModel.findVerificationToken(
        verificationToken
      );

      if (!userToVerify) {
        throw new NotFound("User not found");
      }

      await usersModel.verifyUser(userToVerify._id);

      const filePath =
        path.join(__dirname).slice(0, path.join(__dirname).length - 28) +
        "/file.collector/index.html";

      return res.status(200).sendFile(filePath);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserControllerRegistration();
