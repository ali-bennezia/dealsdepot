const articleModel = require("./../models/database/articleModel");

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
