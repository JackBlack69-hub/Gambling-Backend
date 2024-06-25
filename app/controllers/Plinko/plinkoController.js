const outcomes = require("./outcomes");

class PlinkoController {
  constructor(TOTAL_DROPS, MULTIPLIERS) {
    this.TOTAL_DROPS = TOTAL_DROPS;
    this.MULTIPLIERS = MULTIPLIERS;
  }

  async betPlinko(req, res) {
    try {
      let outcome = 0;
      const pattern = [];
      for (let i = 0; i < this.TOTAL_DROPS; i++) {
        if (Math.random() > 0.5) {
          pattern.push("R");
          outcome++;
        } else {
          pattern.push("L");
        }
      }

      const multiplier = this.MULTIPLIERS[outcome];
      const possiblieOutcomes = outcomes[outcome];

      res.json({
        point:
          possiblieOutcomes[
            Math.floor(Math.random() * possiblieOutcomes.length || 0)
          ],
        multiplier,
        pattern,
      }); // reverse to get the most recent messages at the bottom
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to Bet" });
    }
  }
}

module.exports = PlinkoController;
