const moongose = require("moongose");

const GamesSchema = new mongoose.Schema({
  game_code: {
    type: string,
    required: true,
  },
  game_name: {
    type: String,
    required: true,
  },
  max_player_size: {
    type: Number,
    required: true,
  },
});

const Games = moongose.model("Games", GamesSchema);
module.exports = Games;
