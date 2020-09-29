const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.TOKEN_SECRET;

const authenticate = (req, res, next) => {
  const token = req.session.token;

  if (token === undefined) return res.sendStatus(401);

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
  });
  next();
};

module.exports = authenticate;
