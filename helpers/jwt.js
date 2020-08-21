const expressJwt = require("express-jwt");
require("dotenv").config();

const jwt = () => {
  const secret = process.env.TOKEN_SECRET;
  console.log("got  here");
  console.log("secret: ", secret);
  return expressJwt({ secret, algorithms: ["HS256"] }).unless({
    path: ["/api/tweets", "/api/users", "/api/login"],
  });
};

module.exports = jwt;
