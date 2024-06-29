const express = require("express");
const router = express.Router();
const CoinFlipController = require("../app/controllers/coinFlipController");

const mockIo = {
  on: () => {},
  emit: () => {},
};

const coinFlipController = new CoinFlipController(mockIo);

router.get(
  "/getAllGames",
  coinFlipController.getAllGames.bind(coinFlipController)
);

module.exports = router;
