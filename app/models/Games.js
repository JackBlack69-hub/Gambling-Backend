const moongose = require('moongose')

const GamesSchema = new mongoose.Schema({
    game_code:{
        type:string,
        required: true
    },
    Game:{
        type:String,
        required: true
    },
    maxPlayerSize:{
        type:Number,
        required: true
    },
});

const Games = moongose.model("Games", GamesSchema)
module.exports = Games