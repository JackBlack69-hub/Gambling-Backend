// index.js
const http = require("http");
const connectDB = require("./config/database");
const app = require("./app/controllers/express-app");
const startSocketServer = require("./app/controllers/websocketController");

const port = process.env.PORT || 8000;

// Connect to MongoDB
connectDB();

// Create HTTP server and integrate Socket.IO
const server = http.createServer(app);

// Start WebSocket server
startSocketServer(server);

// Start the server
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
