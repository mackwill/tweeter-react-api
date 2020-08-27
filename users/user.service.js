require("dotenv").config();
const secret = process.env.TOKEN_SECRET;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
module.exports = {
  authenticate: async function ({ username, password, users }) {
    const user = users.find((u) => {
      return u.username === username && u.password === password;
    });

    if (!user) throw "The username or password you have entered is incorrect!";

    const token = jwt.sign({ username: username }, secret, {
      expiresIn: 60 * 60,
    });
    return {
      ...omitPassword(user),
      token,
    };
  },

  createRegisterToken: async function (user) {
    console.log("body: ", user);

    const token = jwt.sign({ username: user.username }, secret, {
      expiresIn: 60 * 60,
    });
    return {
      ...omitPassword(user),
      token,
    };
  },
};

const omitPassword = (user) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
