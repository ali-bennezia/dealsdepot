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
const NODE_ENV = process.env.NODE_ENV;
if (!DB_URL) throw "No database URL found.";
if (!process.env.SECRET_KEY) throw "No secret key found.";
if (!NODE_ENV || (NODE_ENV !== "production" && NODE_ENV !== "development"))
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

// routing

const userRouter = require("./routes/userRouting");
app.use("/api/user", userRouter);

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
