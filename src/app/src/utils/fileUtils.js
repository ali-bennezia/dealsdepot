const fs = require("fs");
const { v4 } = require("uuid");
const path = require("path");
const mime = require("mime-types");

/**
 * Attempts to create a directory relative to the root project if it doesn't exist.
 * @param dirPath The directory path.
 */
exports.tryCreateDirectory = function tryCreateDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
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
  fs.writeSync(fd, buff, 0, sizeInBytes, 0);
  fs.closeSync(fd);
  return name;
};

/** 
    Stores an image in the images directory given a file.
    @param file The file.
    @returns The newly created image file's name.
*/
exports.storeImageFile = function storeImageFile(file) {
  return this.storeImageBuffer(
    file.buffer,
    file.size,
    mime.extension(file.mimetype)
  );
};

/** 
    Stores all image files given in an array.
    @param files The buffer.
    @returns An array containing all the newly created images' file names.
*/
exports.storeImageFiles = function storeImageFiles(files) {
  return files
    .filter((f) => {
      return f.mimetype.startsWith("image/");
    })
    .map((f) => {
      return this.storeImageBuffer(
        f.buffer,
        f.size,
        mime.extension(f.mimetype)
      );
    });
};

/**
 * Delete an image from the images directory given its file name if it exists.
 * @param fileName The name of the image file to delete.
 */
exports.tryDeleteImage = function tryDeleteImage(fileName) {
  let filePath = path.join("images", fileName);
  if (fs.existsSync(filePath)) fs.rmSync(filePath);
};
