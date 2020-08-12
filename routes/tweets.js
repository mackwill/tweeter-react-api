const router = require("express").Router();

module.exports = (db) => {
  router.get("/tweets", (req, res) => {
    return db
      .query("SELECT * FROM tweets")
      .then((data) => {
        res.status(200);
        res.json(data.rows);
      })
      .catch((err) => {
        res.status(500);
        console.err("error", err);
      });
  });

  return router;
};
