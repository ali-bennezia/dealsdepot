const fileUtils = require("./../utils/fileUtils");
const articleUtils = require("./../utils/articleUtils");
const sanitationUtils = require("./../utils/sanitationUtils");

const userModel = require("./../models/database/userModel");
const articleModel = require("./../models/database/articleModel");
const articleVoteModel = require("./../models/database/articleVoteModel");

const checkArticleCreateDTO = require("./../models/dtos/article/articleCreateDTO");
const checkArticleEditDTO = require("./../models/dtos/article/articleEditDTO");

/**
 * GET /api/article?query=..&minclicks=..&maxclicks=..&minviews=..&maxviews=..&tags=..&sortBy=..&sortOrder=..
 * Article search API.
 * The sortOrder parameter must be either 1 or -1.
 */
const sortFilters = ["title", "content", "clicks", "views", "totalVotes"];
exports.getSearch = async function (req, res) {
  try {
    let filterOptions = {},
      sortOptions = {};

    if ("query" in req) {
      let queryObject = req.query;
      if ("query" in queryObject && queryObject?.query != "") {
        filterOptions = { $text: { $search: queryObject.query } };
      }
      if ("minclicks" in queryObject || "maxclicks" in queryObject) {
        let minClicks = Number(queryObject?.minclicks);
        let maxClicks = Number(queryObject?.maxclicks);

        filterOptions = {
          ...filterOptions,
          clicks: {
            $gte: minClicks,
            $lte: maxClicks,
          },
        };
        sanitationUtils.trimPropertiesByPredicate(
          filterOptions.clicks,
          (val) => val == undefined || val == NaN || val == null || isNaN(val)
        );
        if (filterOptions.clicks == {}) delete filterOptions.clicks;
      }
      if ("minviews" in queryObject || "maxviews" in queryObject) {
        let minViews = Number(queryObject?.minviews);
        let maxViews = Number(queryObject?.maxviews);
        filterOptions = {
          ...filterOptions,
          views: {
            $gte: minViews,
            $lte: maxViews,
          },
        };
        sanitationUtils.trimPropertiesByPredicate(
          filterOptions.views,
          (val) => val == undefined || val == NaN || val == null || isNaN(val)
        );
        if (filterOptions.views == {}) delete filterOptions.views;
      }
      if ("tags" in queryObject) {
        let tags = [];
        try {
          tags = JSON.parse(queryObject.tags);
        } catch (jsonErr) {
          tags = null;
        }
        if (!Array.isArray(tags) || tags == null) return res.sendStatus(400);
        filterOptions = {
          ...filterOptions,
          tags: { $in: tags },
        };
      }

      if ("sortBy" in queryObject) {
        if (!sortFilters.includes(queryObject.sortBy))
          return res.sendStatus(400);
        let sortOrder = Number(queryObject?.sortOrder) ?? 1;
        if (sortOrder !== -1 && sortOrder !== 1) sortOrder = 1;
        sortOptions[queryObject.sortBy] = sortOrder;
      }
    }

    if (sortOptions == {}) sortOptions = undefined;

    let results = await articleModel.paginate(filterOptions, {
      page: 0,
      limit: 10,
      sort: sortOptions,
    });
    return res.status(200).json(results.docs);
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
        await articleUtils.getArticleOutboundDTOAsync(
          await articleModel.create(await articleModel.findById(req.params.id))
        )
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
    return res
      .status(201)
      .json(
        await articleUtils.getArticleOutboundDTOAsync(
          await articleModel.create(createArticle)
        )
      );
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
    if ((await articleModel.exists({ _id: req.params.id })) == null)
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
    await articleUtils.tryDeleteArticleVotesAsync(articleId);
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
