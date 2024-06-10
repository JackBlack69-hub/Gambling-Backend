const CoinFlip = require("../models/CoinFlip");
const { v4: uuidv4 } = require("uuid");

class CoinFlipController {
  constructor(io) {
    this.io = io;
    this.initializeSocketListeners();
  }

  // Initialize socket listeners
  initializeSocketListeners() {
    this.io.on("connection", (socket) => {
      console.log("A user connected for coinflip");

      socket.on("createGame", this.handleCreateGame.bind(this, socket));

      //   socket.on("joinGame", this.handleJoinGame.bind(this, socket));

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });
  }

  // Handle create game event
  async handleCreateGame(socket, data) {
    try {
      const inviteCode = uuidv4();
      const newGame = new CoinFlip({
        betAmount: data.betAmount,
        totalBetAmount: data.betAmount,
        inviteCode,
        players: [data.player],
      });
      const savedGame = await newGame.save();

      socket.join(inviteCode);
      this.io.emit("gameCreated", savedGame);
    } catch (err) {
      console.error("Error creating game:", err);
      socket.emit("error", "Failed to create game");
    }
  }
}

module.exports = CoinFlipController;
