const mime = require("mime-types");

const fileUtils = require("./../utils/fileUtils");

const articleModel = require("./../models/database/articleModel");
const articleVoteModel = require("./../models/database/articleVoteModel");

const checkArticleCreateDTO = require("./../models/dtos/article/articleCreateDTO");

exports.postCreateApi = async function (req, res) {
  try {
    if (!checkArticleCreateDTO(req.body)) return res.sendStatus(400);
    let medias = (req.files ?? [])
      .map((f) => {
        return {
          buffer: f.buffer,
          sizeInBytes: f.size,
          extension: mime.extension(f.mimetype),
        };
      })
      .map((data) => {
        return fileUtils.storeImageBuffer(
          data.buffer,
          data.sizeInBytes,
          data.extension
        );
      });
    let createArticle = {
      link: req.body.link,
      title: req.body.title,
      content: req.body.content,
      tags: req.body.tags.split(" "),
      medias: medias,
    };
    return res.status(201).json(await articleModel.create(createArticle));
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};
