const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // password: {
  //   type: String,
  //   required: true,
  // },
  phonenumber: {
    type: String,
    required: true,
  },

  education: {
    type: String,
    required: true,
  },
  college: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: false,
  },
  yearOfCompletion: {
    type: Number,
    required: false,
  },
  role: {
    type: String,
    default: "User",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

mongoose.model("users", UserSchema);
