const router = require("express").Router();
const database = require("../database");
const authenticate = require("../helpers/authenticateToken");

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
        res.status(200);
        res.json(tweets);
      })
      .catch((error) => {
        res.status(500);
        console.error("Error creating new tweet: ", error);
        res.send(error);
      });
  });

  router.put("/favourite", authenticate, (req, res) => {
    const { tweetId, userId } = req.body;

    return database
      .doesUserLikeTweet(tweetId, userId)
      .then((data) => {
        if (data.length > 0) {
          return database.unFavouriteTweet(tweetId, userId);
        }
        return database.favouriteTweet(tweetId, userId);
      })
      .then(() => {
        return database.getTweetFavouriteCount(tweetId);
      })
      .then((favouriteCount) => {
        res.status(200);
        res.json(favouriteCount);
      })
      .catch((error) => {
        console.error("Error favouriting tweet: ", error);
        res.status(500);
        res.send(error);
      });
  });

  return router;
};
