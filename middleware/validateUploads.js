const multer = require("multer");
const jwt = require("jsonwebtoken");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const decoded = jwt.verify(token, "mySecretKey");

    req.filename = `${decoded.userId}.${file.mimetype.split("/")[1]}`;
    cb(null, `${decoded.userId}.${file.mimetype.split("/")[1]}`);
  },
});

const upload = multer({ storage: storage });

module.exports = { upload };
