const sanitationUtils = require("./../../utils/sanitationUtils");

const properties = ["email", "password", "rememberMe"];
const types = {
  email: [String, "string"],
  password: [String, "string"],
  rememberMe: [Boolean, "boolean"],
};

module.exports = function check(dto) {
  return (
    sanitationUtils.containsOnlyAllProperties(dto, properties) &&
    sanitationUtils.checkTypes(dto, types)
  );
};
