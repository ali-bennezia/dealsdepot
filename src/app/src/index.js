const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();

const configUtils = require("./utils/configUtils");
const fileUtils = require("./utils/fileUtils");

// config

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
dotenv.config();
fileUtils.tryCreateDirectory("images");

const PORT = process.env.PORT ?? 5000;
const DB_URL = process.env.DB_URL;
const env = process.env.NODE_ENV;

if (!DB_URL) throw "No database URL found.";
if (!process.env.SECRET_KEY) throw "No secret key found.";
if (env === undefined || (env != "production" && env != "development"))
  throw "Incorrect NODE_ENV value. Must be either 'production', or 'development'.";

let cfg = configUtils.getConfig();

app.all("*", function (req, res, next) {
  res.set("Access-Control-Allow-Origin", cfg.uiUri);
  res.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Origin"
  );
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use("/content/image", express.static("images"));

// routing

const userRouting = require("./routes/userRouting");
const articleRouting = require("./routes/articleRouting");

app.use("/api/user", userRouting);
app.use("/api/article", articleRouting);

// boot

app.listen(PORT, (err) => {
  if (err) {
    throw err;
  } else {
    console.log(`Server successfully listening on port ${PORT}.`);
    mongoose
      .connect(DB_URL)
      .then(() => {
        console.log(`Successfully connected to the database.`);
      })
      .catch((err) => {
        throw err;
      });
  }
});
