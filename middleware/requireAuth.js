const jwt = require("jsonwebtoken");
const User = require("../SchemaModel/userSchema");

const requireAuth = async (req, res, next) => {
  // verify authentication

  // const { authorization } = req.headers;
  const token = req.cookies?.user;

  // if (!authorization) {
  //   return res.status(401).json({ error: "Authorization token required" });
  // }
  if (!token) {
    return res.status(401).json({ error: "Authentication token required" });
  }

  // const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    req.user = await User.findOne({ _id }).select("_id");
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = requireAuth;
