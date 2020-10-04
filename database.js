const db = require("./server");

const getUserByUsername = (username) => {
  return db
    .query(
      `
    SELECT id, username, first_name AS "firstName", last_name AS "lastName", email, password, profile_picture_url AS "profilePictureUrl", date_joined AS "dateJoined" FROM users 
    WHERE username = $1;
    `,
      [`${username}`]
    )
    .then((res) => res.rows[0])
    .catch((error) => {
      console.log("error ", error);
      throw new Error(error);
    });
};

exports.getUserByUsername = getUserByUsername;

const getUserByEmail = (email) => {
  return db
    .query(
      `
  SELECT * FROM users
  WHERE email = $1
  `,
      [email]
    )
    .then((res) => res.rows[0])
    .catch((error) => {
      console.log("No user found with that email", error);
      throw new Error(error);
    });
};

exports.getUserByEmail = getUserByEmail;

const getUserById = (id) => {
  return db
    .query(
      `
  SELECT id, username, first_name AS "firstName", last_name AS "lastName", email, password, profile_picture_url AS "profilePictureUrl", date_joined AS "dateJoined" FROM users 
  WHERE id = $1
  `,
      [id]
    )
    .then((res) => res.rows[0])
    .catch((error) => {
      console.log("Error: ", error);
      throw new Error(error);
    });
};

exports.getUserById = getUserById;

const registerUser = (newUser) => {
  console.log("new user:", newUser);
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    profilePictureUrl,
  } = newUser;

  return db
    .query(
      `
INSERT INTO users (username, first_name, last_name, email, password, profile_picture_url)
VALUES
  ($1, $2, $3, $4, $5, $6)
RETURNING *;
`,
      [username, firstName, lastName, email, password, profilePictureUrl]
    )
    .then((res) => res.rows[0])
    .catch((error) => {
      console.log("Error: ", error);
      throw new Error(error);
    });
};

exports.registerUser = registerUser;

const getAllTweets = () => {
  console.log("getAllTweets");
  return db
    .query(
      `
  SELECT tweets.id, tweets.user_id AS "userId", tweets.content, tweets.tweet_date AS "tweetDate", users.first_name AS "firstName", users.last_name AS "lastName", users.username, users.profile_picture_url AS "profilePictureURL",
  (SELECT COUNT(*) FROM favourites
  WHERE tweet_id = tweets.id
  ) AS "tweetFavourites"
  FROM tweets 
  JOIN users ON user_id = users.id
  ORDER BY tweet_date DESC;  
  `
    )
    .then((res) => {
      return res.rows;
    })
    .catch((error) => {
      console.log("error: ", error);
      throw new Error(error);
    });
};

exports.getAllTweets = getAllTweets;

const newTweet = (tweetContent, userId) => {
  return db
    .query(
      `
  INSERT INTO tweets (user_id, content)
  VALUES ($1, $2)
  RETURNING *;
  `,
      [userId, tweetContent]
    )
    .then((res) => res.rows[0]);
};

exports.newTweet = newTweet;

const doesUserLikeTweet = (tweetId, userId) => {
  return db
    .query(
      `
  SELECT * FROM favourites
  WHERE user_id = $1
  AND tweet_id = $2
  `,
      [userId, tweetId]
    )
    .then((res) => {
      console.log("doesUserLikeTweet res", res.rows);
      return res.rows;
    })
    .catch((error) => {
      console.log("Error: ", error);
      throw new Error(error);
    });
};

exports.doesUserLikeTweet = doesUserLikeTweet;

const favouriteTweet = (tweetId, userId) => {
  return db
    .query(
      `
    INSERT INTO favourites (user_id, tweet_id)
    VALUES ($1, $2)
    RETURNING *;
    `,
      [userId, tweetId]
    )
    .then((res) => res.rows[0])
    .catch((error) => {
      console.log("Error: ", error);
      throw new Error(error);
    });
};

exports.favouriteTweet = favouriteTweet;

const unFavouriteTweet = (tweetId, userId) => {
  return db.query(
    `
  DELETE FROM favourites
  WHERE user_id = $1
  AND tweet_id = $2
  `,
    [userId, tweetId]
  );
};

exports.unFavouriteTweet = unFavouriteTweet;

const getTweetFavouriteCount = (tweetId) => {
  return db
    .query(
      `
  SELECT COUNT(*) FROM favourites
  WHERE tweet_id = $1
  `,
      [tweetId]
    )
    .then((res) => res.rows[0]);
};

exports.getTweetFavouriteCount = getTweetFavouriteCount;
