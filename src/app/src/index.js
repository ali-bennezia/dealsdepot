const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();

// config

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
dotenv.config();

const PORT = process.env.PORT ?? 5000;
const DB_URL = process.env.DB_URL;
if (!DB_URL) throw "No database URL found.";
if (!process.env.SECRET_KEY) throw "No secret key found.";

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
