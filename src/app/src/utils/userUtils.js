exports.getUserOutboundDTO = function getUserOutboundDTO(doc) {
  return {
    id: doc._id.toString(),
    username: doc.username,
    profilePictureFileName: doc?.profilePictureFileName ?? null,
    roles: doc.roles,
  };
};
