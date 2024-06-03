const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const HASH_SECRET_KEY = process.env.HASH_SECRET_KEY;

const schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 4,
      maxlength: 25,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 320,
    },
    password: { type: String, required: true, minlength: 8, maxlength: 128 },
  },
  { timestamps: true }
);

schema.pre("save", function () {
  if (this.isModified("password"))
    this.password = bcrypt.hashSync(this.password, HASH_SECRET_KEY);
});

module.exports = mongoose.model("user", schema);
