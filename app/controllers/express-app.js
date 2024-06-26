// express-app.js
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRoutes = require("../../routes/userRoutes");
const tournamentRoutes = require("../../routes/tournamentRoutes");
const chatRoutes = require("../../routes/chatRoutes");
const plinkoRoutes = require("../../routes/plinkoRoutes");
const coinFlipRoutes = require("../../routes/coinflipRoutes");
const path = require("path");

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
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
console.log("TEST", path.join(__dirname, "../../uploads"));
app.use("/uploads", express.static(path.join(__dirname, "../..", "uploads")));

// Routes
app.use("/api/user", userRoutes);
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/plinko", plinkoRoutes);
app.use("/api/coinFlip", coinFlipRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the port no " + process.env.PORT);
});

// Serve the success page
app.get("/success", (req, res) => {
  res.send("Success");
});

module.exports = app;
