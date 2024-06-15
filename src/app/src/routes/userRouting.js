const express = require("express");
const router = express.Router();
const controller = require("./../controllers/userController");
const authMiddlewares = require("./../middlewares/authMiddlewares");

router.post(
  "/register",
  authMiddlewares.isAnonymousMiddleware,
  controller.postRegisterApi
);
router.post(
  "/signin",
  authMiddlewares.isAnonymousMiddleware,
  controller.postSignInApi
);
router.get(
  "/profile",
  authMiddlewares.isAuthenticatedMiddleware,
  controller.getProfileApi
);
router.get("/:id", controller.getUserByIdApi);

module.exports = router;
