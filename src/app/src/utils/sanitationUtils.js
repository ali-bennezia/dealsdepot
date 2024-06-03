exports.containsAllProperties = function containsAllProperties(
  object,
  properties
) {
  for (let p in properties) {
    if (!p in object) return false;
  }
  return true;
};

exports.containsAnyProperties = function containsAnyProperties(
  object,
  properties
) {
  for (let p in properties) {
    if (p in object) return true;
  }
  return false;
};
