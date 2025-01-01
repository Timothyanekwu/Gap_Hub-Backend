const express = require("express");

const {
  loginUser,
  signupUser,
  sendToken,
  verifyToken,
  resetPassword,
} = require("../controllers/userController");
const router = express.Router();

// login route
router.post("/login", loginUser);

// signup route
router.post("/signup", signupUser);

// verify email
router.post("/sendToken", sendToken);

router.post("/verifytoken", verifyToken);

router.put("/resetpassword", resetPassword);

module.exports = router;
