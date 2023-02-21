const todosModel = require("./todos.model");
const usersModel = require("../users/users.model");
const Joi = require("joi");
const {
  prepareReturnUserData,
} = require("../users/users.controllers/users.controllers.common");

const {
  Types: { ObjectId },
} = require("mongoose");

class TodosController {
  validateAddNewTodo(req, res, next) {
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

  async removeTodoById(req, res, next) {
    try {
      const todo = await todosModel.findByIdAndRemove(
        ObjectId(req.params.todoId)
      );

      if (!todo) {
        return res.status(404).json({
          error: "Todo not found",
        });
      }

      return res.status(200).json({
        message: "Todo deleted",
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTodoStatus(req, res, next) {
    try {
      const contactId = req.params.contactId;
      const requestBody = req.body;

      if (!requestBody.favorite) {
        return res.status(400).json({ message: "missing field favorite" });
      }

      const updateResults = await contactModel.findByIdAndUpdate(
        contactId,
        requestBody,
        { new: true }
      );

      return res.status(200).json(updateResults);
    } catch (error) {
      next({ message: "Not found" });
    }
  }

  validateUpdateTodo(req, res, next) {
    const validationSchema = Joi.object({
      title: Joi.string(),
      difficulty: Joi.string().valid("easy", "hard", "normal"),
      date: Joi.string(),
      time: Joi.string(),
      status: Joi.string(),
      category: Joi.string(),
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

  async updateTodo(req, res, next) {
    try {
      const todoId = req.params.todoId;
      const requestBody = req.body;

      const updateResults = await todosModel.findByIdAndUpdate(
        todoId,
        requestBody
      );

      if (!updateResults) {
        return res.status(404).json({
          error: "Todo is not found",
        });
      }

      return res.status(200).json({ message: "Todo updated" });
    } catch (error) {
      next({
        error: error,
        message: "Todo is not found",
      });
    }
  }

  // async updateTodoDone(req, res, next) {
  //   try {
  //     const todoId = req.params.todoId;
  //     const requestBody = {
  //       status: "done",
  //     };

  //     const updateResults = await todosModel.findByIdAndUpdate(
  //       todoId,
  //       requestBody
  //     );

  //     if (!updateResults) {
  //       return res.status(404).json({
  //         error: "Todo is not found",
  //       });
  //     }

  //     return res
  //       .status(200)
  //       .json({ message: "Todo status updated to 'done' " });
  //   } catch (error) {
  //     next({
  //       error: error,
  //       message: "Todo is not found",
  //     });
  //   }
  // }
}

module.exports = new TodosController();
