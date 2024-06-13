const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const schema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    link: { type: String, required: true, minlength: 4, maxlength: 256 },
    title: { type: String, required: true, minlength: 4, maxlength: 64 },
    content: { type: String, required: true, minlength: 6, maxlength: 256 },
    clicks: { type: Number, required: true, default: 0 },
    views: { type: Number, required: true, default: 0 },
    totalVotes: { type: Number, required: true, default: 0 },
    medias: [{ type: String }],
    tags: [{ type: String }],
  },
  { timestamps: true }
);

schema.index({ title: "text", content: "text", tags: "text" });
schema.plugin(mongoosePaginate);

module.exports = mongoose.model("article", schema);
