const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userModel = require("./../models/database/userModel");
const userUtils = require("./../utils/userUtils");

const checkUserRegisterDTO = require("./../models/dtos/user/userRegisterDTO");
const checkUserLoginDTO = require("./../models/dtos/user/userLoginDTO");

exports.postRegisterApi = async function (req, res) {
  try {
    if (
      !checkUserRegisterDTO(req.body) ||
      req.body.password !== req.body.confirmPassword
    )
      return res.sendStatus(400);

    if (
      (await userModel.exists({
        $or: [{ email: req.body.email }, { username: req.body.username }],
      })) != null
    ) {
      return res.sendStatus(409);
    }

    let createUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    };
    let newUser = await userModel.create(createUser);

    return res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};

exports.postSignInApi = async function (req, res) {
  try {
    if (!checkUserLoginDTO(req.body)) return res.status(400).send();

    let foundUser = await userModel.findOne({
      email: req.body.email,
    });
    if (
      foundUser == null ||
      !bcrypt.compareSync(req.body.password, foundUser.password)
    ) {
      return res.sendStatus(401);
    }

    let payload = {
      userId: foundUser._id.toString(),
      username: foundUser.username,
      roles: foundUser.roles,
      signedInAtTime: new Date().getTime(),
      createdAtTime: foundUser.createdAt.getTime(),
    };
    let token = jwt.sign(
      payload,
      process.env.SECRET_KEY,
      req.body.rememberMe ? { expiresIn: "14 days" } : { expiresIn: "7 days" }
    );

    return res.status(200).json({
      id: foundUser._id.toString(),
      token: token,
      username: foundUser.username,
      roles: foundUser?.roles ?? [],
      profilePictureFileName: foundUser?.profilePictureFileName ?? null,
      createdAtTime: foundUser.createdAt.getTime(),
    });
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};

exports.getUserByIdApi = async function (req, res) {
  try {
    if (!req?.params || !("id" in req.params)) return res.status(400).send();

    let foundUser = await userModel.findById(req.params.id);
    if (foundUser == null) return res.sendStatus(404);

    return res.status(200).json(userUtils.getUserOutboundDTO(foundUser));
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};

exports.getProfileApi = async function (req, res) {
  try {
    let foundUser = await userModel.findById(
      req.authenticationData.payload.userId
    );
    if (foundUser == null) return res.sendStatus(404);

    return res.status(200).json(userUtils.getProfileOutboundDTO(foundUser));
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};
