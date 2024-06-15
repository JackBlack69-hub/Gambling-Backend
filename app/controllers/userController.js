User = require("../models/User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

class UserController {
  generateVerificationToken() {
    return crypto.randomBytes(20).toString("hex");
  }

  async signUp(req, res) {
    try {
      const { username, email, password } = req.body;

      const domain = email.split("@")[1];

      const hasSMTP = await this.domainHasSMTP(domain);
      if (!hasSMTP) {
        return res
          .status(400)
          .json({ error: "Email domain does not have SMTP server" });
      }

      const existingUser = await User.findOne({ email });
      // if (existingUser) {
      //   return res.status(400).json({ error: "User already exists" });
      // }

      const newUser = new User({
        username,
        email,
        password,
        accountActivated: false,
      });

      const verificationToken = this.generateVerificationToken();
      newUser.verificationToken = verificationToken;

      await newUser.save();

      await this.sendVerificationEmail(email, newUser._id, verificationToken);

      return res.status(201).json({
        verificationToken,
        message: "User created successfully. Please verify your email.",
      });
    } catch (error) {
      console.error("Error signing up user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      console.log(email, password);

      const user = await User.findOne({ email });

      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = jwt.sign(
        { userId: user._id, userName: user.username },
        "mySecretKey",
        {
          expiresIn: "7d",
        }
      );

      return res
        .status(200)
        .json({ token, message: "User logged in successfully" });
    } catch (error) {
      console.error("Error logging in user:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async domainHasSMTP(domain) {
    return new Promise((resolve, reject) => {
      require("dns").resolveMx(domain, (err, addresses) => {
        if (err || addresses.length === 0) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  async sendVerificationEmail(email, userId, verificationToken) {
    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "majhanavinacc@gmail.com",
        pass: "mvxt jgqo qfoh wxem",
      },
    });

    const verificationLink = `http://localhost:8000/api/user/verifyEmail?token=${verificationToken}&userId=${userId}`;

    const emailContent = `
        <div>
        <p>Please verify your email to activate your account.</p>
        <a href="${verificationLink}">Verify Email</a>
        </div>
    `;

    await transporter.sendMail({
      from: "majhanavinacc@gmail.com",
      to: email,
      subject: "Email Verification",
      text: emailContent,
      html: emailContent,
    });
  }

  async verifyEmail(req, res) {
    const token = req.query.token;
    const userId = req.query.userId;

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.verificationToken !== token) {
      return res.status(400).json({ error: "Invalid verification token" });
    }

    user.accountActivated = true;
    await user.save();

    console.log("EMAIL VERIFICATION CLICKED", token);
    return res.status(200).json({ message: "Email verified successfully" });
  }

  async getUser(req, res) {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    const decoded = jwt.verify(token, "mySecretKey");

    res.status(200).send({ decoded });
  }

  async gelAllUsers(req, res) {
    try {
      const users = await User.find({});
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}

module.exports = UserController;
