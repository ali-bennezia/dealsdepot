const articleModel = require("./../models/database/articleModel");
const articleVoteModel = require("./../models/database/articleVoteModel");
const userModel = require("./../models/database/userModel");

const fileUtils = require("./fileUtils");
const userUtils = require("./userUtils");

exports.tryDeleteArticleMediasAsync =
  async function tryDeleteArticleMediasAsync(articleId) {
    let article = await articleModel.findById(articleId);

    let medias = article?.medias ?? [];
    for (let m of medias) {
      fileUtils.tryDeleteImage(m);
    }
    article.medias = [];
    await article.save();
  };

exports.tryDeleteArticleVotesAsync = async function tryDeleteArticleVotesAsync(
  articleId
) {
  let article = await articleModel.findById(articleId);
  if (article != null) {
    await articleVoteModel.deleteMany({ article: articleId }).exec();
  }
};

exports.getArticleOutboundDTOAsync = async function getArticleOutboundDTOAsync(
  doc
) {
  return {
    ...doc.toObject(),
    clicks: doc?.clicks ?? 0,
    views: doc?.views ?? 0,
    votes: {
      for: await articleVoteModel
        .countDocuments({ article: doc._id.toString(), vote: true })
        .exec(),
      against: await articleVoteModel
        .countDocuments({ article: doc._id.toString(), vote: false })
        .exec(),
    },
    authorData: userUtils.getUserOutboundDTO(
      await userModel.findById(doc.author)
    ),
  };
};
