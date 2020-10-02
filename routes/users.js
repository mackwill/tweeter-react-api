const router = require("express").Router();
const database = require("../database");
const jwt = require("jsonwebtoken");
const authenticate = require("../helpers/authenticateToken");
require("dotenv").config();
const secret = process.env.TOKEN_SECRET;

module.exports = () => {
  const login = (username, password) => {
    console.log("username", username);

    return database
      .getUserByUsername(username)
      .then((user) => {
        if (user.password === password) {
          return user;
        }
        throw new Error("Invalid Password");
      })
      .catch((error) => {
        res.status(500);
        res.send("Invalid Login");
      });
  };

  // router.get("/users", authenticate, (req, res) => {
  router.get("/users", authenticate, (req, res) => {
    console.log("session.user: ", req.user);
    if (req.user) {
      return database
        .getUserById(req.user.id)
        .then((data) => res.send({ data }))
        .catch((error) => {
          res.status(500);
          res.json(error);
          console.error("Error: ", err);
        });
    }
    res.end();
  });

  router.post("/login", (req, res) => {
    const { username, password } = req.body;
    login(username, password)
      .then((user) => {
        if (!user) {
          throw new Error();
        }
        const accessToken = jwt.sign(user, secret);
        req.session.token = accessToken;
        res.json({ user, accessToken });
        res.status(200);
      })
      .catch((error) => {
        res.status(500);
        res.send("Error logging in");
      });
  });

  router.put("/register", (req, res) => {
    console.log("req.body: ", req.body);

    Promise.all([
      Promise.resolve(database.getUserByUsername(req.body.username)),
      Promise.resolve(database.getUserByEmail(req.body.email)),
    ])
      .then((all) => {
        if (all[0] || all[1]) {
          throw new Error("That username or email already exists");
        }
        return database.registerUser(req.body);
      })
      .then((user) => {
        console.log("user: ", user);
        if (!user) {
          throw new Error("Error registering user");
        }
        const accessToken = jwt.sign(user, secret);
        req.session.token = accessToken;
        res.json({ user, accessToken });
        res.status(200);
      })
      .catch((error) => {
        res.status(500);
        res.send(error);
      });
  });

  router.post("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
  });

  return router;
};
