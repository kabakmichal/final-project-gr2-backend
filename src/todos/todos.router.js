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

module.exports = router;
