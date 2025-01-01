const User = require("../SchemaModel/userSchema");
const jwt = require("jsonwebtoken");
const redisClient = require("../lib/redis");
const mailer = require("../lib/mailer");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "2d" });
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signup user
const signupUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const user = await User.signup(username, email, password);
    const token = createToken(user._id);
    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const sendToken = async (req, res) => {
  const { email } = req.body;

  try {
    // Ensure Redis is connected
    await redisClient.connect();

    const user = await User.getUserByEmail(email);
    if (user) {
      const otpcode = Math.random().toString(36).substring(2, 8).toUpperCase();
      console.log(`Generated OTP: ${otpcode}`);

      const message = `Please use this OTP ${otpcode} to verify your email`;
      await redisClient.set(email, otpcode, 3600); // Ensure Redis is ready before setting
      mailer.sendEmail("donotreply", email, message, "Password Reset");

      return res.status(200).json({ message: "OTP sent" });
    } else {
      return res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error in sendToken:", error);
    return res.status(500).json({ error: error.message });
  }
};

const verifyToken = async (req, res) => {
  const { email, otpcode } = req.body;

  try {
    const token = await redisClient.get(email);
    if (token === otpcode) {
      res.status(200).json({ message: "OTP verified" });
    } else {
      res.status(400).json({ message: "OTP not verified" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.updatePassword(email, password);
    res.status(200).json({ message: "Password updated" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signupUser,
  loginUser,
  resetPassword,
  verifyToken,
  sendToken,
};
