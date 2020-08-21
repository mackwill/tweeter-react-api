const router = require("express").Router();
const expressJwt = require("express-jwt");
const jwt = require("jsonwebtoken");
const authenticate = require("../users/user.service");
require("dotenv").config();
const secret = process.env.TOKEN_SECRET;

module.exports = (db) => {
  router.get("/users", (req, res) => {
    return db
      .query(
        `
    SELECT * FROM users
    `
      )
      .then((data) => {
        res.status(200);
        res.json(data.rows);
      })
      .catch((err) => {
        res.status(500);
        console.error("Error: ", err);
      });
  });

  router.post("/login", (req, res) => {
    console.log("req.body: ", req.body);
    authenticate(req.body)
      .then((user) => {
        res.json(user);
        // console.log("here");
      })
      .catch(next);
    console.log("req: ", req);
  });

  return router;
};
