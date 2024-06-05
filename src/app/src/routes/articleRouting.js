const express = require("express");
const multer = require("multer");

const upload = multer();
const router = express.Router();
const controller = require("./../controllers/articleController");
const authMiddlewares = require("./../middlewares/authMiddlewares");

router.get("", controller.getSearch);

router.get("/:id", controller.getFindByIdApi);

router.post(
  "",
  authMiddlewares.isAuthenticatedMiddleware,
  upload.array("images"),
  controller.postCreateApi
);

router.delete(
  "/:id",
  authMiddlewares.isAuthenticatedMiddleware,
  controller.deleteRemoveApi
);

router.patch(
  "/:id",
  authMiddlewares.isAuthenticatedMiddleware,
  upload.none(),
  controller.patchEditApi
);

router.delete(
  "/:articleId/media",
  authMiddlewares.isAuthenticatedMiddleware,
  controller.deleteMediasApi
);

router.delete(
  "/:articleId/media/:fileName",
  authMiddlewares.isAuthenticatedMiddleware,
  controller.deleteMediaApi
);

router.post(
  "/:articleId/media",
  authMiddlewares.isAuthenticatedMiddleware,
  upload.single("file"),
  controller.postCreateMediaApi
);

module.exports = router;
