const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

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
    clicks: { type: Number },
    views: { type: Number },
    medias: [{ type: String }],
    tags: [{ type: String }],
  },
  { timestamps: true }
);

schema.plugin(mongoosePaginate);

module.exports = mongoose.model("article", schema);
