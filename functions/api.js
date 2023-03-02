const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const serverless = require("serverless-http");

const todoRouter = require("../src/todos/todos.router.js");
const usersRouter = require("../src/users/users.router.js");

const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const rootRouter = express.Router();

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Questify Todo Api",
      version: "1.0.0",
      contact: {
        name: "Group 2",
        email: "zhyryk1997@gmail.com",
      },
      servers: ["http://localhost:3000"],
    },
  },
  apis: ["./src/*.js"],
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);

rootRouter.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

rootRouter.use("/todos", todoRouter);
rootRouter.use("/users", usersRouter);

async function main() {
  try {
    await mongoose.connect(process.env.MONGOOSE_DB_URL);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

main();

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";
app.use(express.static("public"));
app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/.netlify/functions/api", rootRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

/**
 * @openapi: 3.0.3
 * paths:
 *   /api/todos/register:
 *     post:
 *       tags:
 *         - User Routes
 *       summary: Register an user
 *       description: Register an user
 *       operationId: registerUser
 *       requestBody:
 *         description: register an user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *         required: true
 *       responses:
 *         '200':
 *           description: Successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/UserRegistrationResponse'
 *         '409':
 *           description: email or username is already registered
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/UserRegistrationErrorResponse'
 *         '400':
 *           description: validation data error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/UserValidationError'
 *         '500':
 *           description: sendGrid error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/SendGridErrorResponse'
 *   /api/users/login:
 *     put:
 *       tags:
 *         - User Routes
 *       summary: User Login
 *       description: User Login
 *       operationId: userLogin
 *       responses:
 *         '401':
 *           description: validation data error
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/UserValidationError'
 *         '200':
 *           description: Successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/UserSuccessLogin'
 *   /api/users/logout:
 *     put:
 *       tags:
 *         - User Routes
 *       summary: User Logout
 *       description: User Logout.
 *       operationId: userLogout
 *       parameters:
 *         - name: Authorization
 *           in: header
 *           description: 'Some token'
 *           required: false
 *           schema:
 *             type: string
 *       responses:
 *         '204':
 *           description: successful operation
 *           content:
 *             application/json:
 *               schema:
 *                   $ref: '#/components/schemas/UserLogout'
 *         '401':
 *           description: Not Authorized
 *           content:
 *             application/json:
 *               schema:
 *                   $ref: '#/components/schemas/AuthorizationError'
 *   /api/todos:
 *     get:
 *       tags:
 *         - todos
 *       summary: get all Todos
 *       description: get all Todos
 *       operationId: getAllTodos
 *       parameters:
 *         - name: Authorization
 *           in: header
 *           description: 'Some token'
 *           required: false
 *           schema:
 *             type: string
 *       responses:
 *         '200':
 *           description: successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/UserAllTodoList'
 *         '401':
 *           description: Not Authorized
 *           content:
 *             application/json:
 *               schema:
 *                   $ref: '#/components/schemas/AuthorizationError'
 *     post:
 *       tags:
 *         - todos
 *       summary: Add new Todo
 *       description: 'Add new Todo'
 *       operationId: addNewTodo
 *       parameters:
 *         - name: Authorization
 *           in: header
 *           description: 'Some token'
 *           required: false
 *           schema:
 *             type: string
 *       requestBody:
 *         description: add new todo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TodoElement'
 *         required: true
 *       responses:
 *         '201':
 *           description: successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/AddNewTodoResponse'
 *         '401':
 *           description: Not Authorized
 *           content:
 *             application/json:
 *               schema:
 *                   $ref: '#/components/schemas/AuthorizationError'
 *   /api/todos/{todoId}:
 *     delete:
 *       tags:
 *         - todos
 *       summary: Deletes todo
 *       description: delete todo
 *       operationId: deleteTodo
 *       parameters:
 *         - name: Authorization
 *           in: header
 *           description: 'Some token'
 *           required: false
 *           schema:
 *             type: string
 *         - name: todoId
 *           in: path
 *           description: todo id to delete
 *           required: true
 *           schema:
 *             type: integer
 *             format: int64
 *       responses:
 *         '200':
 *           description: Operation success
 *           content:
 *             application/json:
 *               schema:
 *                   $ref: '#/components/schemas/TodoDeleted'
 *         '401':
 *           description: Not Authorized
 *           content:
 *             application/json:
 *               schema:
 *                   $ref: '#/components/schemas/AuthorizationError'
 *         '404':
 *           description: Todo not found
 *           content:
 *             application/json:
 *               schema:
 *                   $ref: '#/components/schemas/TodoNotFound'
 *     put:
 *       tags:
 *         - todos
 *       summary: update Todo
 *       description: update Todo
 *       operationId: updateTodo
 *       parameters:
 *         - name: Authorization
 *           in: header
 *           description: 'Some token'
 *           required: false
 *           schema:
 *             type: string
 *         - name: todoId
 *           in: path
 *           description: todo id to delete
 *           required: true
 *           schema:
 *             type: integer
 *             format: int64
 *       responses:
 *         '200':
 *           description: Operation success
 *           content:
 *             application/json:
 *               schema:
 *                   $ref: '#/components/schemas/TodoUpdated'
 *         '400':
 *           description: Todo Validation Error
 *           content:
 *             application/json:
 *               schema:
 *                   $ref: '#/components/schemas/UserRegistrationResponse'
 *         '401':
 *           description: Not Authorized
 *           content:
 *             application/json:
 *               schema:
 *                   $ref: '#/components/schemas/AuthorizationError'
 *         '404':
 *           description: Todo not found
 *           content:
 *             application/json:
 *               schema:
 *                   $ref: '#/components/schemas/TodoNotFound'
 *   /api/todos/{todoId}/finished:
 *     put:
 *       tags:
 *         - todos
 *       summary: set todo status finished
 *       description: set todo status finished
 *       operationId: setTodoStatusFinished
 *       parameters:
 *         - name: Authorization
 *           in: header
 *           description: 'Some token'
 *           required: false
 *           schema:
 *             type: string
 *         - name: todoId
 *           in: path
 *           description: todo id to delete
 *           required: true
 *           schema:
 *             type: integer
 *             format: int64
 *       responses:
 *         '200':
 *           description: Operation success
 *           content:
 *             application/json:
 *               schema:
 *                   $ref: '#/components/schemas/TodoSetStatusDone'
 *         '401':
 *           description: Not Authorized
 *           content:
 *             application/json:
 *               schema:
 *                   $ref: '#/components/schemas/AuthorizationError'
 *         '404':
 *           description: Todo not found
 *           content:
 *             application/json:
 *               schema:
 *                   $ref: '#/components/schemas/TodoNotFound'
 *
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           example: theUser
 *         email:
 *           type: string
 *           example: john@email.com
 *         password:
 *           type: string
 *           example: '12345'
 *     UserRegistrationResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "some validation error"
 *     UserLogout:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "User logged out"
 *     TodoDeleted:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Todo deleted"
 *     TodoSetStatusDone:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Todo status updated to 'done' "
 *     TodoNotFound:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Todo not found"
 *     AuthorizationError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Not Authorized"
 *     UserAllTodoList:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               example: 'example@example.com'
 *             username:
 *               type: string
 *               example: 'some username'
 *             verify:
 *               type: boolean
 *               example: false
 *             todoListIds:
 *               type: array
 *               items:
 *                type: object
 *                properties:
 *                  title:
 *                    type: string
 *                    example: 'some title'
 *                  date:
 *                    type: string
 *                    example: '21.01.2015'
 *                  time:
 *                    type: string
 *                    example: '13:00:00'
 *                  category:
 *                    type: string
 *                    example: 'some category'
 *                  difficulty:
 *                    type: string
 *                    example: 'easy'
 *                  status:
 *                    type: string
 *                    example: 'undone'
 *                  type:
 *                    type: string
 *                    example: 'quest'
 *         token:
 *           type: string
 *           example: 'some token'
 *     UserRegistrationErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "email or username is already registered"
 *     UserValidationError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Email/username or password is wrong"
 *     UserSuccessLogin:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               example: 'example@example.com'
 *             username:
 *               type: string
 *               example: 'some username'
 *             verify:
 *               type: boolean
 *               example: false
 *             todoListIds:
 *               type: array
 *               example: ['someIds']
 *         token:
 *           type: string
 *           example: 'some token'
 *     UserLoginDataError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "some validation error"
 *     SendGridErrorResponse:
 *       type: object
 *       properties:
 *         serverMessage:
 *           type: string
 *           example: "validation message failed"
 *         responseMsg:
 *           type: string
 *           example: "Sendgrid error"
 *     TodoElement:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: 'some title'
 *         date:
 *           type: string
 *           example: '21.01.2015'
 *         time:
 *           type: string
 *           example: '13:00:00'
 *         category:
 *           type: string
 *           example: 'some category'
 *         difficulty:
 *           type: string
 *           example: 'easy'
 *         status:
 *           type: string
 *           example: 'undone'
 *         type:
 *           type: string
 *           example: 'quest'
 *     TodoUpdated:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Todo updated"
 *     AddNewTodoResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "some validation error"
 *         todo:
 *           $ref: '#/components/schemas/TodoElement'
 */

module.exports.handler = serverless(app);
