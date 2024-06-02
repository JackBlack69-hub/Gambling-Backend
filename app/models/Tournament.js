const mongoose = require("mongoose");

const TournamentsSchema = new mongoose.Schema({
    game_name: {
        type: String,
        required: false
    },
    initiator: {
        type: String,
        required: false
    },
    winner: {
        type: String,
        required: false
    },
    bet_amount: {
        type: Number,
        required: false
    },
    registrationEndTime: {
        type: Date,
        required: false
    },
    participants: {
        type: [String],
        required: false
    }
});

const Tournament = mongoose.model("Tournament", TournamentsSchema);
module.exports = Tournament;
