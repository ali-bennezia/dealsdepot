const sanitationUtils = require("./../../utils/sanitationUtils");

const properties = ["username", "email", "password", "confirmPassword"];
const types = {
  username: [String, "string"],
  email: [String, "string"],
  password: [String, "string"],
  confirmPassword: [String, "string"],
};

module.exports = function check(dto) {
  return (
    sanitationUtils.containsOnlyAllProperties(dto, properties) &&
    sanitationUtils.checkTypes(dto, types)
  );
};
