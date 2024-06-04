const sanitationUtils = require("../../../utils/sanitationUtils");

const properties = ["link", "title", "content", "tags"];
const types = {
  link: [String, "string"],
  title: [String, "string"],
  content: [String, "string"],
  tags: [String, "string"],
};

module.exports = function check(dto) {
  return (
    sanitationUtils.containsOnlyAllProperties(dto, properties) &&
    sanitationUtils.checkTypes(dto, types)
  );
};
