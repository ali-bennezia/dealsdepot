const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    link: { type: String, required: true, minlength: 4, maxlength: 128 },
    title: { type: String, required: true, minlength: 4, maxlength: 32 },
    content: { type: String, required: true, minlength: 6, maxlength: 256 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("article", schema);
