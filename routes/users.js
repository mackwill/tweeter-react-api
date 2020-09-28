const router = require("express").Router();
const database = require("../helpers/database");
const expressJwt = require("express-jwt");
const jwt = require("jsonwebtoken");
// const authenticateModule = require("../users/user.service");
// const authenticate = authenticateModule.authenticate;
// const createRegisterToken = authenticateModule.createRegisterToken;
const authenticate = require("../helpers/authenticateToken");
require("dotenv").config();
const secret = process.env.TOKEN_SECRET;

module.exports = (db) => {
  const getUserByUsername = (username) => {
    console.log("thios", username);
    return db
      .query(
        `
      SELECT * FROM users 
      WHERE username = $1;
      `,
        [`${username}`]
      )
      .then((res) => res.rows[0])
      .catch((error) => console.log("error ", error));
  };

  const getUserById = (id) => {
    return db
      .query(
        `
    SELECT * FROM users
    WHERE id = $1
    `,
        [id]
      )
      .then((res) => res.rows[0])
      .catch((error) => res.status(500));
  };

  const login = (username, password) => {
    console.log("username", username);

    return getUserByUsername(username)
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

  router.get("/users", authenticate, (req, res) => {
    console.log("session.user: ", req.user);
    if (req.user) {
      getUserById(req.user.id)
        .then((data) => res.send({ data }))
        .catch((error) => {
          res.status(500);
          res.json(error);
          console.error("Error: ", err);
        });
    }
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

    const {
      first_name,
      last_name,
      username,
      email,
      password,
      profile_picture_url,
    } = req.body;
    return db
      .query(
        `
    INSERT INTO users (username, first_name, last_name, email, password, profile_picture_url)
    VALUES
      ($1, $2, $3, $4, $5, $6)
    RETURNING *;
    `,
        [username, first_name, last_name, email, password, profile_picture_url]
      )
      .then((data) => {
        console.log("server datta: ", data.rows);
        return createRegisterToken(data.rows);
      })
      .then((user) => {
        console.log("user after register: ", user);
        req.session.userId = user.id;
        req.session.token = user.token;
        return user;
      })
      .then((user) => {
        res.status(200);
        res.json(user);
      })
      .catch((err) => {
        res.status(500);
        console.log("Error: ", err);
        res.end();
      });
  });

  router.post("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
  });

  return router;
};
