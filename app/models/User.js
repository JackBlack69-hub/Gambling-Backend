const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  walletAddress: {
    type: String,
    require: false,
  },
  accountActivated: {
    type: Boolean,
    require: true,
  },
  pfp: {
    type: String,
    require: false,
  },
  verificationToken: {
    type: String,
    require: false,
  }
});

const User = mongoose.model("User", usersSchema);
module.exports = User;
