const router = require("express").Router();
const expressJwt = require("express-jwt");
const jwt = require("jsonwebtoken");
const authenticate = require("../users/user.service");
const authenticateToken = require("../helpers/authenticateToken");
require("dotenv").config();
const secret = process.env.TOKEN_SECRET;

module.exports = (db) => {
  router.get("/users", (req, res) => {
    console.log("session.user: ", req.session.userId);
    return db
      .query(
        `
    SELECT * FROM users
    `
      )
      .then((data) => {
        const returnObj = {
          users: data.rows,
        };

        if (req.session.token) {
          console.log("data: ", data.rows);
          jwt.verify(req.session.token, secret, (err, user) => {
            if (err) {
              return res.status(403);
            }
            req.user = req.session.userId;
            current = data.rows.filter((user) => {
              return user.id === req.session.userId;
            });
            returnObj["currentUser"] = current[0];
          });
          console.log("VERIFICATION: REQ.USER: ", req.user);
        }
        res.status(200);
        res.json(returnObj);
      })
      .catch((err) => {
        res.status(500);
        console.error("Error: ", err);
      });
  });

  router.post("/login", (req, res) => {
    console.log("req.body: ", req.body);
    return authenticate(req.body)
      .then((user) => {
        console.log("user  in users.js: ", user);

        req.session.userId = user.id;
        req.session.token = user.token;
        // console.log("session: ", req.session);
        return user;
      })
      .then((user) => {
        res.status(200);
        res.json(user);
      })
      .catch((err) => {
        res.status(500);
        console.error("Error: ", err);
      });
  });

  return router;
};
