const fs = require("fs");
const { v4 } = require("uuid");
const path = require("path");

/**
 * Attempts to create a directory relative to the root project if it doesn't exist.
 * @param path The directory path.
 */
exports.tryCreateDirectory = function tryCreateDirectory(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
};

/** 
    Stores an image in the images directory given a buffer.
    @param buff The buffer.
    @param sizeInBytes The buffer's size in bytes.
    @param extension The image extension, such as 'jpg' or 'png'.
    @returns The newly created image file's name.
*/
exports.storeImageBuffer = function storeImageBuffer(
  buff,
  sizeInBytes,
  extension
) {
  let id = v4();
  let name = `${id}.${extension}`;
  let filePath = path.join("images", name);
  let fd = fs.openSync(filePath, "w");
  fd.writeSync(fd, buff, 0, sizeInBytes, 0);
  fd.closeSync(fs);
  return name;
};
