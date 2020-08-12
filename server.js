// load .env data into process.env
require("dotenv").config();

const PORT = process.env.PORT || 3002;
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const tweets = require("./routes/tweets");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./config/db.config");

const db = new Pool(dbParams);
db.connect();

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api", tweets(db));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
