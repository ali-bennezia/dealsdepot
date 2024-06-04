const express = require("express");
const router = express.Router();
const controller = require("./../controllers/userController");

router.post("/register", controller.postRegisterApi);
router.post("/signin", controller.postSignInApi);

module.exports = router;
