// load .env data into process.env
require("dotenv").config();

const PORT = process.env.PORT || 3002;
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");

const tweets = require("./routes/tweets");
const users = require("./routes/users");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./config/db.config");

const db = new Pool(dbParams);
db.connect();

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// use JWT authentication to secure the API
app.use(jwt());

// Routes
app.use("/api", tweets(db));
app.use("/api", users(db));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
