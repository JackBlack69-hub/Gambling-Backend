const express = require("express");
const router = express.Router();
const { validateToken } = require("../middleware/validateTokens");
const PlinkoController = require("../app/controllers/Plinko/plinkoController");

// Temporary fix: Mocking the io instance for HTTP routes
const TOTAL_DROPS = 16;

const MULTIPLIERS = {
  0: 16,
  1: 9,
  2: 2,
  3: 1.4,
  4: 1.4,
  5: 1.2,
  6: 1.1,
  7: 1,
  8: 0.5,
  9: 1,
  10: 1.1,
  11: 1.2,
  12: 1.4,
  13: 1.4,
  14: 2,
  15: 9,
  16: 16,
};
const plinkoController = new PlinkoController(TOTAL_DROPS, MULTIPLIERS);

router.get(
  "/placeBetPlinko",
  plinkoController.betPlinko.bind(plinkoController)
);

module.exports = router;
