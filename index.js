const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const userRoutes = require("./routes/userRoutes");
const tournamentRoutes = require("./routes/tournamentRoutes");

dotenv.config({ path: __dirname + "/.env" });
app.use(express.static(__dirname));

const mongoURI = process.env.MONGODB_URI;
const port = process.env.PORT || 8000;

mongoose
  .connect(mongoURI, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"));

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send(`Welcome to the port no ${port}`);
});

app.use("/api/user", userRoutes);
app.use("/api/tournaments", tournamentRoutes);

// Serve the success page
app.get("/success", (req, res) => {
  res.send("Success");
});

// Create HTTP server and integrate Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Use the WebSocket controller
const websocketController = require("./app/controllers/websocketController");
websocketController(io);

// Start the server
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
