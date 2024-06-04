const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const sanitationUtils = require("./../utils/sanitationUtils");

const userModel = require("./../models/database/userModel");

const checkUserRegisterDTO = require("./../models/dtos/userRegisterDTO");
const checkUserLoginDTO = require("./../models/dtos/userLoginDTO");

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
      username: foundUser.username,
    };
    let token = jwt.sign(
      payload,
      process.env.SECRET_KEY,
      req.body.rememberMe ? { expiresIn: "14 days" } : { expiresIn: "7 days" }
    );

    return res.status(200).json(token);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};
