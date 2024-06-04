exports.containsAtleastAllProperties = function containsAtleastAllProperties(
  object,
  properties
) {
  for (let p of properties) {
    if (!(p in object)) return false;
  }
  return true;
};

exports.containsAnyProperties = function containsAnyProperties(
  object,
  properties
) {
  for (let p of properties) {
    if (p in object) return true;
  }
  return false;
};

exports.containsAnyOtherProperties = function containsAnyOtherProperties(
  object,
  properties
) {
  for (let p in object) {
    if (!properties.includes(p)) return true;
  }
  return false;
};

exports.containsOnlyAllProperties = function containsOnlyAllProperties(
  object,
  properties
) {
  console.log(object);
  console.log(properties);
  console.log(this.containsAtleastAllProperties(object, properties));
  console.log(this.containsAnyOtherProperties(object, properties));
  return (
    this.containsAtleastAllProperties(object, properties) &&
    !this.containsAnyOtherProperties(object, properties)
  );
};

exports.checkType = function checkType(
  object,
  propertyName,
  instanceOf,
  typeOf
) {
  return (
    propertyName in object &&
    (typeof object[propertyName] === typeOf ||
      object[propertyName] instanceof instanceOf)
  );
};

exports.checkTypes = function checkTypes(object, types) {
  for (let p in types) {
    if (!this.checkType(object, p, types[p][0], types[p][1])) return false;
  }
  return true;
};
