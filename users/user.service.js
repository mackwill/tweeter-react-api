require("dotenv").config();
const secret = process.env.TOKEN_SECRET;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function authenticate({ username, password, users }) {
  // console.log("user:", username);
  // console.log("pass: ", password);
  // console.log("users:", users);
  // const saltRounds = 10;
  // const hashedPassword = bcrypt.hashSync(password, saltRounds);
  // console.log("hashed pass: ", hashedPassword);

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
}

const omitPassword = (user) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

module.exports = authenticate;
