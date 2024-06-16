const Chat = require("../models/Chat");

class ChatController {
  constructor(io) {
    this.io = io;
    this.initializeSocketListeners();
  }

  // Fetch all chat messages
  async getAllChats(req, res) {
    try {
      const chats = await Chat.find().sort({ timestamp: 1 }).limit(50);
      res.json(chats.reverse()); // reverse to get the most recent messages at the bottom
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch chat messages" });
    }
  }

  // Create a new chat message
  async createChat(req, res) {
    const { user, message } = req.body;
    try {
      const newChat = new Chat({ user, message });
      const savedChat = await newChat.save();
      res.json(savedChat);
    } catch (err) {
      res.status(500).json({ error: "Failed to save chat message" });
    }
  }

  // Save chat message to the database
  async saveChat(data) {
    const { user, message } = data;
    const newChat = new Chat({ user, message });
    try {
      return await newChat.save();
    } catch (err) {
      console.error("Failed to save chat message", err);
      throw err;
    }
  }

  // Initialize socket listeners
  initializeSocketListeners() {
    this.io.on("connection", (socket) => {
      console.log("a user connected");

      socket.on("disconnect", () => {
        console.log("user disconnected");
      });

      socket.on("message", async (msg) => {
        console.log("message: " + JSON.stringify(msg));

        try {
          const savedChat = await this.saveChat(msg);
          this.io.emit("message", savedChat);
        } catch (err) {
          console.error("Error saving message:", err);
        }
      });
    });
  }
}

module.exports = ChatController;
