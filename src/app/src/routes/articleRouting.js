const express = require("express");
const multer = require("multer");

const upload = multer();
const router = express.Router();
const controller = require("./../controllers/articleController");
const authMiddlewares = require("./../middlewares/authMiddlewares");

router.post(
  "",
  authMiddlewares.isAuthenticatedMiddleware,
  upload.array("images"),
  controller.postCreateApi
);

module.exports = router;
