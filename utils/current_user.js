const jwt = require("jsonwebtoken");
const User = require("../app/models/User");

const current_user = async (token) => {
  try {
    const secret_key = "mySecretKey";
    const decoded = jwt.verify(token, secret_key);
    const user = await User.findById(decoded.userId);
    return user;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

module.exports = current_user;
