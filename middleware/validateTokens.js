const jwt = require("jsonwebtoken");
const validateToken = (req, res, next) => {
  const secretKey = "mySecretKey";

  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secretKey);
    const currentTime = Math.floor(Date.now() / 1000);
    if (!token) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    if (!decoded) {
      res.status(401).json({ error: "Invalid token" });
    }
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = { validateToken };
