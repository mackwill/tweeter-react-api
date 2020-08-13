const router = require("express").Router();

module.exports = (db) => {
  router.get("/tweets", (req, res) => {
    return db
      .query(
        `
      SELECT tweets.*, users.first_name, users.last_name, users.username, users.profile_picture_url FROM tweets 
      JOIN users ON user_id = users.id
      ORDER BY tweet_date DESC
      `
      )
      .then((data) => {
        res.status(200);
        res.json(data.rows);
      })
      .catch((err) => {
        res.status(500);
        console.err("error", err);
      });
  });

  router.put("/tweets", (req, res) => {
    console.log("req", req.body);
    const { user_id, content, tweet_date } = req.body;

    return db
      .query(
        `
    INSERT INTO tweets (user_id, content)
    VALUES ($1, $2)
    RETURNING *;
    `,
        [user_id, content]
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
