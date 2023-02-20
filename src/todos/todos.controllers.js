const todosModel = require("./todos.model");
const usersModel = require("../users/users.model");
const Joi = require("joi");
const {
  prepareReturnUserData,
} = require("../users/users.controllers/users.controllers.common");

class TodosController {
  validateAddNewTodo(req, res, next) {
    console.log("babababababababa");

    const validationSchema = Joi.object({
      title: Joi.string().required(),
      difficulty: Joi.string().required().valid("easy", "hard", "normal"),
      date: Joi.string().required(),
      time: Joi.string().required(),
      status: Joi.string().required(),
      category: Joi.string().required(),
    });

    const todoData = req.body;
    const result = validationSchema.validate(todoData);
    if (result?.error) {
      return res
        .status(400)
        .json({
          message: result.error.details[0].message,
        })
        .send();
    }

    next();
  }

  async addNewTodo(req, res, next) {
    try {
      const requestBody = req.body;
      const userId = req.user.id;
      const todo = await todosModel.create(requestBody);
      await usersModel.findOneAndUpdate(
        userId,
        {
          $push: { todoListIds: todo._id },
        },
        { new: true }
      );

      return res.status(201).json({ todo, message: "Todo added" });
    } catch (error) {
      next(error);
    }
  }

  async getAllUserTodos(req, res, next) {
    console.log(req.user);

    try {
      const userId = req.user.id;

      const userData = await usersModel
        .findById(userId)
        .populate("todoListIds");

      return res.status(200).json(prepareReturnUserData([userData]));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TodosController();
