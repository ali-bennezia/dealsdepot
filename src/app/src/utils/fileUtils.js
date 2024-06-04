const fs = require("fs");

exports.tryCreateDirectory = function tryCreateDirectory(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
};
