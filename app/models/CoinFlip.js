const mongoose = require('mongoose')

const coinFlipSchema = new mongoose.Schema({
    player1: {
        type: String,
        ref: 'User',
        required: true
    },
    player2: {
        type: String,
        ref: 'User',
    },
    gameId: {
        type: Number,
        ref: 'Tournaments',
        required: true
    },
    betSize: {
        type: Number,
        required: true
    }
});

const CoinFlip = mongoose.model("CoinFlip", coinFlipSchema)
module.exports = CoinFlip