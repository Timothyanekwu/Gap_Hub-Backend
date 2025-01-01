const User = require("../SchemaModel/userSchema");
const jwt = require("jsonwebtoken");
const redisClient = require("../lib/redis");
const mailer = require("../lib/mailer");

const getProperties = async (req, res) => {
  try {
    const result = await propertyFormat.find({});

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getProperties,
};
