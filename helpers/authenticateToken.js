const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.TOKEN_SECRET;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("authheader: ", authHeader);

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.status(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401);
  }
};

module.exports = authenticateToken;
