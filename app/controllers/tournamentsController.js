const Tournament = require("../models/Tournament");

class TournamentsController {
    async createTournament(req, res) {
        console.log("EXECUTING")
        try {
            const { game_code, bet_amount, no_of_players } = req.body;
            const newTournament = new Tournament({
                game_code: game_code,
                bet_amount: bet_amount,
            });
            await newTournament.save();
            return res.status(201).json({ message: "Tournament created successfully" });
        } catch (error) {
            console.error("Error creating tournament:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async getTournamentsByGame(req, res) {
        try {
            const { game_name } = req.query;
            const tournaments = await Tournament.find({ game_name });
            console.log(game_name, tournaments)
            return res.status(200).json({ tournaments });
        } catch (error) {
            console.error("Error fetching tournaments by game:", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async joinTournamennt(req,res){
        try {
            const {participant} = req.body;
            
        } catch (error) {
            console.error(error)
            return res.status(500).json({error: "Internal Server Error"})
        }
    }
}

module.exports = TournamentsController;
