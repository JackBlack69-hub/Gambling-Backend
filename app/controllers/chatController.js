const Chat = require("../models/Chat");
const User = require("../models/User");

class ChatController {
  constructor(io) {
    this.io = io;
    this.initializeSocketListeners();
    this.count = 0;
  }

  // Fetch all chat messages
  async getAllChats(req, res) {
    try {
      const chats = await Chat.find()
        .populate("user", "username pfp")
        .sort({ timestamp: 1 })
        .limit(50);

      const chatsWithUserDetails = chats.map((chat) => {
        const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
          chat.user.pfp
        }`;
        return {
          message: chat.message,
          timestamp: chat.timestamp,
          username: chat.user.username,
          pfp: fileUrl,
          // other fields from chat if needed
        };
      });

      res.json(chatsWithUserDetails.reverse()); // reverse to get the most recent messages at the bottom
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch chat messages" });
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
      this.count += 1;
      this.io.emit("count", this.count);

      socket.on("disconnect", () => {
        console.log("user disconnected");
        this.count -= 1;
        this.io.emit("count", this.count);
      });

      socket.on("message", async (msg) => {
        console.log("message: " + JSON.stringify(msg));

        // Use authenticated user from the socket
        const newMsg = { user: socket.user, message: msg.message };

        try {
          const savedChat = await this.saveChat(newMsg);

          const chats = await Chat.findById(savedChat._id)
            .populate("user", "username pfp")
            .exec();
          const fileUrl = `http://localhost:8000/uploads/${chats.user.pfp}`;

          const send = {
            username: chats.user.username,
            message: chats.message,
            timestamp: chats.timestamp,
            pfp: fileUrl,
          };

          this.io.emit("message", send);
        } catch (err) {
          console.error("Error saving message:", err);
        }
      });
    });
  }
}

module.exports = ChatController;
