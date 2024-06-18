// middlewares/authenticateSocket.js
const current_user = require("../utils/current_user");

const authenticateSocket = async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const user = await current_user(token);
    if (!user) {
      return next(new Error("Authentication error: User not found"));
    }
    socket.user = user; // Save the user in the socket object
    next();
  } catch (error) {
    return next(new Error("Authentication error: " + error.message));
  }
};

module.exports = authenticateSocket;
