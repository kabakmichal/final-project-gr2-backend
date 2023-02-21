const express = require("express");
const router = express.Router();

const todoController = require("./todos.controllers");

const {
  userAuthorization,
} = require("../users/users.controllers/users.controllers.common");

router.post(
  "/",
  userAuthorization,
  todoController.validateAddNewTodo,
  todoController.addNewTodo
);

router.get("/", userAuthorization, todoController.getAllUserTodos);

router.delete("/:todoId", userAuthorization, todoController.removeTodoById);

router.put(
  "/:todoId/finished",
  userAuthorization,
  todoController.updateTodoDone
);

router.put(
  "/:todoId",
  userAuthorization,
  todoController.validateUpdateTodo,
  todoController.updateTodo
);

module.exports = router;
