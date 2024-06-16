// controllers/websocketController.js
const socketio = require("socket.io");
const ChatController = require("./chatController");
const CoinFlipController = require("./coinFlipController");

const startSocketServer = (server) => {
  try {
    const io = socketio(server, {
      cors: {
        origin: "http://localhost:5173", // Your React app's URL
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true,
      },
    });

    // Instantiate ChatController with the socket.io instance
    new ChatController(io);
    new CoinFlipController(io);

    console.log("WebSocket >>", "Connected!");
  } catch (error) {
    // console.log(`WebSocket ERROR >> ${error.message}`);
    process.exit(1);
  }
};

module.exports = startSocketServer;
