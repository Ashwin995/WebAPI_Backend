const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  photo: {
    type: String,
    required: false,
  },
  cv: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("user", UserSchema);


