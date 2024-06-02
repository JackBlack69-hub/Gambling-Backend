const express = require("express");
const router = express.Router();
const { validateToken } = require("../middleware/validateTokens");
const TournamentsController = require("../app/controllers/tournamentsController")

const tournamentController = new TournamentsController

router.post('/createRoom', validateToken, tournamentController.createTournament.bind(tournamentController));
router.get('/fetchTournaments', validateToken, tournamentController.getTournamentsByGame.bind(tournamentController));

module.exports = router