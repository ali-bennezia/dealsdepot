const fileUtils = require("./../utils/fileUtils");
const articleUtils = require("./../utils/articleUtils");
const sanitationUtils = require("./../utils/sanitationUtils");

const userModel = require("./../models/database/userModel");
const articleModel = require("./../models/database/articleModel");
const articleVoteModel = require("./../models/database/articleVoteModel");

const checkArticleCreateDTO = require("./../models/dtos/article/articleCreateDTO");
const checkArticleEditDTO = require("./../models/dtos/article/articleEditDTO");

/**
 * GET /api/article
 * Article search API.
 */
exports.getSearch = async function (req, res) {
  try {
    if (!("params" in req) || !("id" in req.params)) return res.sendStatus(400);
    if (!(await articleModel.exists({ _id: req.params.id })))
      return res.sendStatus(404);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};

/**
 * GET /api/article/:id
 * Article get API.
 */
exports.getFindByIdApi = async function (req, res) {
  try {
    if (!("params" in req) || !("id" in req.params)) return res.sendStatus(400);
    if (!(await articleModel.exists({ _id: req.params.id })))
      return res.sendStatus(404);
    return res
      .status(200)
      .json(
        await articleModel.create(await articleModel.findById(req.params.id))
      );
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};

/**
 * POST /api/article
 * Article creation API.
 * Takes in multipart/form-data.
 * Files may be sent within the 'files' field names.
 * User must be authenticated.
 */
exports.postCreateApi = async function (req, res) {
  try {
    if (!checkArticleCreateDTO(req.body)) return res.sendStatus(400);
    let medias = fileUtils.storeImageFiles(req.files ?? []);
    let createArticle = {
      author: req.authenticationData.payload.userId,
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

/**
 * DELETE /api/article/:id
 * Article delete API.
 * User must either be the article's owner or posses the 'admin' role.
 * User must be authenticated.
 */
exports.deleteRemoveApi = async function (req, res) {
  try {
    if (!("params" in req) || !("id" in req.params)) return res.sendStatus(400);
    if (!(await articleModel.exists({ _id: req.params.id })))
      return res.sendStatus(404);

    let articleId = req.params.id;
    let article = await articleModel.findById(articleId);
    let author = await userModel.findById(article.author);
    let authorRoles = author?.roles ?? [];

    if (
      (author == null ||
        author._id.toString() != req.authenticationData.payload.userId) &&
      !authorRoles.includes("admin")
    )
      return res.sendStatus(403);

    await articleUtils.tryDeleteArticleMediasAsync(articleId);
    await articleModel.deleteOne({ _id: articleId });

    return res.sendStatus(204);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};

/**
 * PATCH /api/article/:id
 * Article update API.
 * Takes in multipart/form-data.
 * User must either be the article's owner or posses the 'admin' role.
 * User must be authenticated.
 */
exports.patchEditApi = async function (req, res) {
  try {
    if (
      !("params" in req) ||
      !("id" in req.params) ||
      !checkArticleEditDTO(req.body)
    )
      return res.sendStatus(400);
    if (!(await articleModel.exists({ _id: req.params.id })))
      return res.sendStatus(404);

    let articleId = req.params.id;
    let article = await articleModel.findById(articleId);
    let author = await userModel.findById(article.author);
    let authorRoles = author?.roles ?? [];

    if (
      (author == null ||
        author._id.toString() != req.authenticationData.payload.userId) &&
      !authorRoles.includes("admin")
    )
      return res.sendStatus(403);

    /*await articleUtils.tryDeleteArticleMediasAsync(articleId);
    article.medias = fileUtils.storeImageFiles(req.files ?? []);*/
    sanitationUtils.applyObject(req.body, article);

    await article.save();

    return res.sendStatus(200);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};

/**
 * POST /api/article/:articleId/media
 * Article media create API.
 * Uploads a media.
 * Media file must be in the 'file' field.
 * Takes in multipart/form-data.
 * User must either be the article's owner or posses the 'admin' role.
 * User must be authenticated.
 */
exports.postCreateMediaApi = async function (req, res) {
  try {
    if (!("params" in req) || !("articleId" in req.params) || !("file" in req))
      return res.sendStatus(400);
    if (!(await articleModel.exists({ _id: req.params.articleId })))
      return res.sendStatus(404);

    let articleId = req.params.articleId;
    let article = await articleModel.findById(articleId);
    let author = await userModel.findById(article.author);
    let authorRoles = author?.roles ?? [];

    if (
      (author == null ||
        author._id.toString() != req.authenticationData.payload.userId) &&
      !authorRoles.includes("admin")
    )
      return res.sendStatus(403);

    let newMedia = fileUtils.storeImageFile(req.file);
    article.medias.push(newMedia);

    await article.save();

    return res.sendStatus(201);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};

/**
 * DELETE /api/article/:articleId/media
 * Article medias delete API.
 * Deletes all of an article's medias.
 * User must either be the article's owner or posses the 'admin' role.
 * User must be authenticated.
 */
exports.deleteMediasApi = async function (req, res) {
  try {
    if (!("params" in req) || !("articleId" in req.params))
      return res.sendStatus(400);
    if (!(await articleModel.exists({ _id: req.params.articleId })))
      return res.sendStatus(404);

    let articleId = req.params.articleId;
    let article = await articleModel.findById(articleId);
    let author = await userModel.findById(article.author);
    let authorRoles = author?.roles ?? [];

    if (
      (author == null ||
        author._id.toString() != req.authenticationData.payload.userId) &&
      !authorRoles.includes("admin")
    )
      return res.sendStatus(403);

    await articleUtils.tryDeleteArticleMediasAsync(articleId);
    await article.save();

    return res.sendStatus(204);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};

/**
 * DELETE /api/article/:articleId/media/:fileName
 * Article media delete API.
 * Deletes an article's media.
 * User must either be the article's owner or posses the 'admin' role.
 * User must be authenticated.
 */
exports.deleteMediaApi = async function (req, res) {
  try {
    if (
      !("params" in req) ||
      !("articleId" in req.params) ||
      !("fileName" in req.params)
    )
      return res.sendStatus(400);
    if (!(await articleModel.exists({ _id: req.params.articleId })))
      return res.sendStatus(404);

    let articleId = req.params.articleId;
    let article = await articleModel.findById(articleId);
    let author = await userModel.findById(article.author);
    let authorRoles = author?.roles ?? [];
    let medias = article?.medias ?? [];
    let fileName = req.params.fileName;

    if (
      (author == null ||
        author._id.toString() != req.authenticationData.payload.userId) &&
      !authorRoles.includes("admin")
    )
      return res.sendStatus(403);

    if (!medias.includes(fileName)) return res.sendStatus(404);

    article.medias = article.medias.filter((m) => m != fileName);
    fileUtils.tryDeleteImage(fileName);
    await article.save();

    return res.sendStatus(204);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};
