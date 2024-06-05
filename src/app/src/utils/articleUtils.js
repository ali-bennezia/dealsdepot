const articleModel = require("./../models/database/articleModel");
const articleVoteModel = require("./../models/database/articleVoteModel");

const fileUtils = require("./fileUtils");

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
