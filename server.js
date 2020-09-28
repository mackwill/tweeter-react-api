// load .env data into process.env
require("dotenv").config();

const PORT = process.env.PORT || 3002;
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");

const app = express();

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./config/db.config");

const db = new Pool(dbParams);
db.connect();

module.exports = db;

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);

const tweets = require("./routes/tweets");
const users = require("./routes/users");

// Routes
app.use("/api", tweets());
app.use("/api", users());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
