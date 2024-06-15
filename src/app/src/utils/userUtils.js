exports.getUserOutboundDTO = function getUserOutboundDTO(doc) {
  return {
    id: doc._id.toString(),
    username: doc.username,
    profilePictureFileName: doc?.profilePictureFileName ?? null,
    roles: doc.roles,
    createdAtTime: doc.createdAt.getTime(),
  };
};

exports.getProfileOutboundDTO = function getProfileOutboundDTO(doc) {
  return {
    id: doc._id.toString(),
    username: doc.username,
    profilePictureFileName: doc?.profilePictureFileName ?? null,
    roles: doc.roles,
    email: doc.email,
    createdAtTime: doc.createdAt.getTime(),
  };
};
