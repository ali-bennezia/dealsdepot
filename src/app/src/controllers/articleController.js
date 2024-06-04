const articleModel = require("./../models/database/articleModel");
const articleVoteModel = require("./../models/database/articleVoteModel");

const checkArticleCreateDTO = require("./../models/dtos/article/articleCreateDTO");

exports.postCreateApi = async function (req, res) {
  try {
    if (!checkArticleCreateDTO(req.body)) return res.sendStatus(400);
    let createArticle = {
      link: req.body.link,
      title: req.body.title,
      content: req.body.content,
      tags: req.body.tags.split(" "),
    };
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};
