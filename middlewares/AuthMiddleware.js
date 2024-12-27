const jwt = require("jsonwebtoken");
require("dotenv").config();
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res
      .json({ message: "Unauthorized Access 1", status: false })
      .status(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .json({ message: "Unauthorized Access 2", status: false })
        .status(401);
    }
    req.user = decoded.user;
    next();
  });
};

module.exports = authMiddleware;
