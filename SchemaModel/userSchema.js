const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: String,
  },
});

// static signup method
userSchema.statics.signup = async function (username, email, password) {
  if (!username || !email || !password) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough");
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    username,
    email,
    password: hash,
  });

  return user;
};

userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw Error("This email does not exist");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Invalid Email and password combination");
  }

  return user;
};

userSchema.statics.getUserByEmail = async function (email) {
  if (!email) throw new Error("Please provide an email");

  if (!validator.isEmail(email)) throw new Error("Invalid email");

  const user = await this.findOne({ email });
  if (!user) throw new Error("No user with this email");

  return user;
};

userSchema.statics.changePassword = async function (
  userId,
  currentPassword,
  newPassword
) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error("invalid user ID");
  }

  const user = await this.findById(userId);

  if (!user) {
    throw new Error("User with this ID does not exist");
  }

  const match = await bcrypt.compare(currentPassword, user.password);

  if (!match) {
    throw new Error("Current password is not correct");
  }

  if (!validator.isStrongPassword(newPassword)) {
    throw new Error("New password is not strong enough");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedPassword;
  user.save();

  return user;
};

module.exports = mongoose.model("User", userSchema);
