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
      socket.on("createGame", this.handleCreateGame.bind(this, socket));
      socket.on("joinGame", this.handleJoinGame.bind(this, socket));

      socket.on("disconnect", () => {
        console.log("User disconnected");
      });
    });
  }

  // Handle create game event
  async handleCreateGame(socket, data) {
    try {
      const inviteCode = uuidv4();
      const user = socket.user;
      const newGame = new CoinFlip({
        betAmount: data.betAmount,
        totalBetAmount: 2 * data.betAmount,
        inviteCode: inviteCode,
        players: [
          {
            userId: user.id,
            coinSide: data.coinSide,
          },
        ],
        created_by: user.id,
        status: 1,
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
      const user = socket.user;
      const game = await CoinFlip.findOne({ inviteCode: data.inviteCode });

      if (!game) {
        socket.emit("error", "Game not found");
        return;
      }

      game.players.push({
        userId: user.id,
        coinSide: "tails",
      });
      game.status = 2;

      const updatedGame = await game.save();

      socket.join(data.inviteCode);
      this.io.emit("updateGameState", updatedGame);
      this.io.to(data.inviteCode).emit("gameJoined", updatedGame);

      await this.startGame(updatedGame);
    } catch (err) {
      console.error("Error joining game:", err);
      socket.emit("error", "Failed to join game");
    }
  }

  // Function to start the game
  async startGame(game) {
    try {
      const winningSide = Math.random() < 0.5 ? "heads" : "tails";
      game.winningSide = winningSide;
      game.status = 3; // Update status to 'Ended'
      const updatedGame = await game.save();

      this.io.to(game.inviteCode).emit("gameEnded", updatedGame);
    } catch (err) {
      console.error("Error starting game:", err);
    }
  }

  async getAllGames(req, res) {
    try {
      const games = await CoinFlip.find({ status: 1 })
        .populate("players.userId", "username pfp")
        .sort({ createdAt: -1 });

      const gamesWithPlayerDetails = games.map((game) => ({
        betAmount: game.betAmount,
        totalBetAmount: game.totalBetAmount,
        inviteCode: game.inviteCode,
        players: game.players.map((player) => ({
          username: player.userId.username,
          pfp: player.userId.pfp
            ? `${req.protocol}://${req.get("host")}/uploads/${
                player.userId.pfp
              }`
            : null,
          coinSide: player.coinSide,
        })),
        created_by: game.created_by,
        status: game.status,
      }));

      res.json(gamesWithPlayerDetails);
    } catch (err) {
      console.error("Error fetching games:", err);
      res.status(500).json({ error: "Failed to fetch games" });
    }
  }
}

module.exports = CoinFlipController;
