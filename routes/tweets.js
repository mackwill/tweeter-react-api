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
    const { tweetContent, userId } = req.body;

    return database
      .newTweet(tweetContent, userId)
      .then(() => {
        return database.getAllTweets();
      })

      .then((tweets) => {
        console.log("tweets:", tweets);
        res.status(200);
        res.json(tweets);
      })
      .catch((error) => {
        res.status(500);
        console.error("Error creating new tweet: ", error);
        res.send(error);
      });
  });

  return router;
};
