const jwt = require("jsonwebtoken");

exports.isAuthenticatedMiddleware = function (req, res, next) {
  let authHeader = req?.headers?.["authorization"];
  if (!authHeader) return res.sendStatus(401);
  let token = authHeader.replace("Bearer ", "");
  let payload = null;
  try {
    payload = jwt.verify(token, process.env.SECRET_KEY);
  } catch (jwtErr) {
    return res.sendStatus(401);
  }
  req.authenticationData = {
    payload: payload,
    token: token,
  };
  next();
};

exports.isAnonymousMiddleware = function (req, res, next) {
  let authHeader = req?.headers?.["authorization"];
  if (authHeader) return res.sendStatus(401);
  next();
};

exports.extractAuthenticationDataMiddleware = function (req, res, next) {
  try {
    let authHeader = req?.headers?.["authorization"];
    let token = authHeader.replace("Bearer ", "");
    let payload = null;
    payload = jwt.verify(token, process.env.SECRET_KEY);
    req.authenticationData = {
      payload: payload,
      token: token,
    };
    next();
  } catch (jwtErr) {
    next();
  }
};
