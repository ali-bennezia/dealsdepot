let cfg =
  process.env === "production"
    ? require("./../../config/production.json")
    : require("./../../config/development.json");

exports.getConfig = function getConfig() {
  return cfg;
};
