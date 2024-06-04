const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  author: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
  },
  article: {
    type: mongoose.Types.ObjectId,
    ref: "article",
    required: true,
  },
  vote: { type: Boolean, required: true },
});

module.exports = mongoose.model("articleVote", schema);
