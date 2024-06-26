const mongoose = require("mongoose");
const User = require("./User");

const playerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    coinSide: {
      type: String,
      enum: ["heads", "tails"],
      required: true,
    },
  },
  { _id: false }
);

const coinFlipSchema = new mongoose.Schema({
  betAmount: Number,
  totalBetAmount: Number,

  privateGame: {
    type: Boolean,
    default: true,
  },

  inviteCode: String, // Custom invite code (only for private games)

  created_by: String,

  players: {
    type: [playerSchema],
    default: [],
  },

  status: {
    type: Number,
    default: 1,
    /**
     * Status list:
     *
     * 1 = Waiting
     * 2 = Rolling
     * 3 = Ended
     */
  },

  //winning Side 1 = red, 2 = blue
  winningSide: {
    type: String,
    default: null,
  },

  // When game was created
  created: {
    type: Date,
    default: Date.now,
  },
});

const CoinFlip = mongoose.model("CoinFlip", coinFlipSchema);
module.exports = CoinFlip;
