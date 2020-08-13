const router = require("express").Router();

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

  return router;
};
