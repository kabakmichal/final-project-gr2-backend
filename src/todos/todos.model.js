const mongoose = require("mongoose");
const { Schema } = mongoose;

const TodoSchema = new Schema({
  title: {
    required: true,
    type: String,
  },
  difficulty: {
    type: String,
    enum: ["easy", "normal", "hard"],
    default: "easy",
    required: true,
  },
  date: {
    required: true,
    type: String,
  },
  time: {
    required: true,
    type: String,
  },
  status: {
    required: true,
    type: String,
  },
  category: {
    required: true,
    type: String,
  },
});

const todosModel = mongoose.model("todo", TodoSchema);

module.exports = todosModel;
