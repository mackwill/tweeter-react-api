const db = require("../server");

const getUserByUsername = (username) => {
  console.log("thios", username);
  return db
    .query(
      `
    SELECT * FROM users 
    WHERE username = 'nicolasCage';
    `,
      [`${username}`]
    )
    .then((res) => {
      console.log("herererere");
      console.log("res.rows getUserByUsername: ", res.rows[0]);
      return res.rows[0];
    })
    .catch((error) => console.log("error ", error));
};

exports.getUserByUsername = getUserByUsername;
