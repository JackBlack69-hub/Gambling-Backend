const CoinFlip = require("../models/CoinFlip");
const { v4: uuidv4 } = require("uuid");
const current_user = require("../../utils/current_user");

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
      socket.on("joinGame", this.handleJoinGame.bind(this, socket));

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
      const user = await current_user(data.player_token);
      const newGame = new CoinFlip({
        betAmount: data.betAmount,
        totalBetAmount: data.betAmount,
        inviteCode: inviteCode,
        players: [
          {
            userId: user.id,
            coinSide: data.coinSide,
          },
        ],
        created_by: user.id,
        status: data.status,
      });
      const savedGame = await newGame.save();

      socket.join(inviteCode);
      this.io.emit("gameCreated", savedGame);
    } catch (err) {
      console.error("Error creating game:", err);
      socket.emit("error", "Failed to create game");
    }
  }

  // Handle join game event
  async handleJoinGame(socket, data) {
    try {
      const user = await current_user(data.player_token);
      const game = await CoinFlip.findOne({ inviteCode: data.inviteCode });

      if (!game) {
        socket.emit("error", "Game not found");
        return;
      }

      game.players.push({
        userId: user.id,
        coinSide: "tails",
      });
      game.status = 2; // Update game status to indicate the game has started

      const updatedGame = await game.save();

      socket.join(data.inviteCode);
      this.io.emit("gameJoined", updatedGame);
    } catch (err) {
      console.error("Error joining game:", err);
      socket.emit("error", "Failed to join game");
    }
  }

  // Function to start the game
  async startGame(game) {
    try {
      // Simulate game result after a delay
      setTimeout(async () => {
        const winningSide = Math.random() < 0.5 ? "red" : "blue";
        game.winningSide = winningSide;
        game.status = 3; // Update status to 'Ended'
        const updatedGame = await game.save();

        this.io.to(game.inviteCode).emit("gameEnded", updatedGame);
      }, 5000); // 5 seconds delay to simulate game processing
    } catch (err) {
      console.error("Error starting game:", err);
    }
  }
}

module.exports = CoinFlipController;
