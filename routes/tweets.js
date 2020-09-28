const router = require("express").Router();
const database = require("../database");

module.exports = () => {
  router.get("/tweets", (req, res) => {
    console.log("herere");
    return database
      .getAllTweets()
      .then((tweets) => {
        res.status(200);
        res.json(tweets);
      })
      .catch((error) => {
        res.status(500);
        res.send(error);
        console.log("Error getting tweets: ", error);
      });
  });

  router.put("/tweets", (req, res) => {
    const { user_id, content } = req.body;

    return database
      .newTweet(user_id, content)
      .then((tweet) => {
        res.status(200);
        res.json(tweet);
      })
      .catch((error) => {
        res.status(500);
        console.error("Error creating new tweet: ", error);
        res.send(error);
      });
  });

  return router;
};
