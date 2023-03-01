const usersModel = require("../users.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { prepareReturnUserData } = require("./users.controllers.common");

class usersControllerAuthentication {
  get userLogIn() {
    return this._userLogIn.bind(this);
  }

  async _userLogIn(req, res, next) {
    try {
      const { email, password, username } = req.body;

      let user = null;

      if (email) {
        [user] = await usersModel.findByEmail(email);
      } else {
        [user] = await usersModel.findByUserName(username);
      }

      if (!user) {
        return res
          .status(401)
          .json({ message: "Email/username or password is wrong" });
      }

      const isPasswordsValid = await bcryptjs.compare(password, user.password);

      if (!isPasswordsValid) {
        return res
          .status(401)
          .json({ message: "Email/username or password is wrong" });
      }

      if (!user.verify) {
        return res.status(400).json({ message: "User is not verified" });
      }
      const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: 60 * 60 * 24 * 2,
      });

      await usersModel.updateToken(user._id, token);

      const [preparedUserData] = prepareReturnUserData([user]);

      return res.status(200).json({
        token,
        user: {
          ...preparedUserData,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async userLogout(req, res, next) {
    try {
      const user = req.user;
      await usersModel.updateToken(user._id, null);
      return res.status(204).json({ message: "User logged out" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new usersControllerAuthentication();
