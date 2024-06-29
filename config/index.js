// // Application Main Config
module.exports = {
  // Each specific game configuration
  games: {
    exampleGame: {
      minBetAmount: 1, // Min bet amount (in coins)
      maxBetAmount: 1000000, // Max bet amount (in coins)
      feePercentage: 0.1, // House fee percentage
    },
    coinflip: {
      minBetAmount: 100, // Min bet amount (in coins)
      maxBetAmount: 100000000, // Max bet amount (in coins)
      feePercentage: 0.05, // House fee percentage
    },
    roulette: {
      minBetAmount: 1000, // Min bet amount (in coins)
      maxBetAmount: 200000, // Max bet amount (in coins)
      feePercentage: 0.05, // House fee percentage
      waitingTime: 15000, // Roulette waiting time in ms
    },
    crash: {
      minBetAmount: 100, // Min bet amount (in coins)
      maxBetAmount: 500000, // Max bet amount (in coins)
      maxProfit: 1000000, // Max profit on crash, forces auto cashout
      houseEdge: 0.08, // House edge percentage
    },
  },
  authentication: {
    jwtSecret: process.env.JWT_SECRET, // Secret used to sign JWT's. KEEP THIS AS A SECRET 45, dont change this
    jwtExpirationTime: 360000, // JWT-token expiration time (in seconds)
  },
};
