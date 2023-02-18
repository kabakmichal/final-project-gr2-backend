const mongoose = require("mongoose");
const { Schema } = mongoose;

// const TodoSchema = new Schema({
//   title: String,
//   difficulty: {
//     type: String,
//     enum: ["easy", "normal", "hard"],
//     default: "easy",
//   },
//   date: String,
//   time: String,
//   status: String,
//   category: String,
// });

const TodoSchema = new Schema({
  id: String,
});

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "Set username for user"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Set password for user"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },

  token: String,
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, "Verify token is required"],
  },
  todoListIds: {
    type: [TodoSchema],
    default: [],
  },
});

userSchema.statics.findByEmail = findByEmail;
userSchema.statics.findByUserName = findByUserName;
// userSchema.statics.updateToken = updateToken;
userSchema.statics.findVerificationToken = findVerificationToken;
userSchema.statics.verifyUser = verifyUser;

async function findByEmail(email) {
  return await this.find({ email: email });
}

async function findByUserName(username) {
  return await this.find({ username: username });
}

// async function updateToken(id, newToken) {
//   return this.findByIdAndUpdate(
//     id,
//     { $set: { token: newToken } },
//     { new: true }
//   );
// }

async function verifyUser(userId) {
  return this.findByIdAndUpdate(
    userId,
    {
      verify: true,
      verificationToken: null,
    },
    { new: true }
  );
}

async function findVerificationToken(verificationToken) {
  return this.findOne({ verificationToken });
}

async function main() {
  try {
    await mongoose.connect(process.env.MONGOOSE_DB_URL);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

main();

const usersModel = mongoose.model("User", userSchema);

module.exports = usersModel;
