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
const definition = require("./swagger.json");

const rootRouter = express.Router();

const options = {
  definition,
  apis: ["./src/*.js"],
};

const swaggerDocs = swaggerJSDoc(options);

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
module.exports.handler = serverless(app);
