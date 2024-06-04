const sanitationUtils = require("./../../utils/sanitationUtils");

const properties = ["email", "password"];
const types = {
  email: [String, "string"],
  password: [String, "string"],
};

module.exports = function check(dto) {
  return (
    sanitationUtils.containsOnlyAllProperties(dto, properties) &&
    sanitationUtils.checkTypes(dto, types)
  );
};
