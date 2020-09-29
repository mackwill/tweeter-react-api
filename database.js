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
    .catch((error) => console.log("error ", error));
};

exports.getUserByUsername = getUserByUsername;

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
    .catch((error) => res.status(500));
};

exports.getUserById = getUserById;

const registerUser = (newUser) => {
  const {
    first_name,
    last_name,
    username,
    email,
    password,
    profile_picture_url,
  } = newUser;

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
    })
    .catch((error) => console.log("Error: ".error));
};

exports.registerUser = registerUser;

const getAllTweets = () => {
  console.log("getAllTweets");
  return db
    .query(
      `
  SELECT tweets.*, users.first_name, users.last_name, users.username, users.profile_picture_url FROM tweets 
  JOIN users ON user_id = users.id
  ORDER BY tweet_date DESC;
  `
    )
    .then((res) => {
      return res.rows;
    })
    .catch((error) => console.log("error: ", error));
};

exports.getAllTweets = getAllTweets;

const newTweet = (userId, content) => {
  return db
    .query(
      `
  INSERT INTO tweets (user_id, content)
  VALUES ($1, $2)
  RETURNING *;
  `,
      [user_id, content]
    )
    .then((res) => res.rows[0]);
};

exports.newTweet = newTweet;
