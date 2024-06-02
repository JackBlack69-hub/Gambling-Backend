const CoinFlip = require('../models/CoinFlip')

class CoinFlipController {
    async initializeGame(req, res, next){
        console.log(req.body);
        try {
            const { username, betSize, gameId } = req.body;
            const newGame = new CoinFlip({
                player1: username,
                betSize: betSize,
                gameId: gameId
            });
            await newGame.save();

            const responseData = {
                player1: username,
                betSize: betSize,
                gameId: gameId
            };

            res.status(200).json(responseData);
        } catch (error) {
            next(error);
        }
    }

    async joinGame(req, res, next){
        console.log(req.body);
        try {
            const { username, gameId } = req.body;
    
            const updatedGame = await CoinFlip.findOneAndUpdate(
                { gameId: gameId },
                { player2: username },
                { new: true }
            );
    
            if (!updatedGame) {
                throw new Error("Game not found");
            }
    
            const responseData = {
                gameId: gameId,
                player2: username
            };
    
            res.status(200).json(responseData);
        } catch (error) {
            next(error);
        }
    };

    async placeBet(req, res, next){
        console.log(req.body)
        try {
            const { gameId, player2Bet } = req.body;
            const updatedGame = await CoinFlip.findOneAndUpdate(
                { gameId: gameId },
                { player2Bet: player2Bet },
                { new: true }
            );
            
            if (!updatedGame) {
                throw new Error("Game not found");
            }
            
            const responseData = {
                gameId: gameId,
                player2Bet: player2Bet
            };
    
            res.status(200).json(responseData);
        } catch (error) {
            next(error);
        }
    };
    
    async playCoinFlip(req, res, next){
        console.log(req.body)
        try {
            const { gameId } = req.body;
            const game = await CoinFlip.findOne({ gameId: gameId });
    
            if (!game) {
                throw new Error("Game not found");
            }
            const decider = Math.random()
            const result = decider < 0.5 ? game.player1 : game.player2;
            console.log(decider ,result)
    
            game.winner = result;
            game.status = "Game finished";
            await game.save();
    
            const responseData = {
                gameId: game._id,
                winner: result,
                status: game.status
            };

            res.status(200).json(responseData);
        } catch (error) {
            next(error);
        }
    }          
    
}

module.exports = new CoinFlipController();