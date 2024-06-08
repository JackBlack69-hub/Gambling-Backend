// controllers/websocketController.js
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("a user connected");

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    socket.on("message", (msg) => {
      console.log("message: " + msg);
      io.emit("message", msg);
    });
  });
};
