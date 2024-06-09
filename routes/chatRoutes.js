// routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const { validateToken } = require("../middleware/validateTokens");
const ChatController = require("../app/controllers/chatController");

// Temporary fix: Mocking the io instance for HTTP routes
const mockIo = {
  on: () => {},
  emit: () => {},
};
const chatController = new ChatController(mockIo);

router.get(
  "/getAllChats",
  //   validateToken,
  chatController.getAllChats.bind(chatController)
);
router.post(
  "/createChat",
  //   validateToken,
  chatController.createChat.bind(chatController)
);

module.exports = router;
