const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");

const todoRouter = require("./todos/todos.router.js");
const usersRouter = require("./users/users.router.js");

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

app.use("/api/todos", todoRouter);
app.use("/api/users", usersRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
