const fs = require('fs');
const path = require('path');
const multer = require('multer');
const appConfig = require('../config/app');
const { resolveUploadDirectory } = require('../helpers/uploadHelper');

const uploadDir = appConfig.uploadDir;
const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const maxFileSize = appConfig.maxFileSize;

const storage = multer.diskStorage({
  destination(req, file, callback) {
    const destinationPath = resolveUploadDirectory(uploadDir);
    fs.mkdirSync(destinationPath, { recursive: true });
    callback(null, destinationPath);
  },
  filename(req, file, callback) {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).slice(2, 12);
    const extension = path.extname(file.originalname).toLowerCase();

    callback(null, `${timestamp}-${randomString}${extension}`);
  },
});

const fileFilter = (req, file, callback) => {
  if (allowedMimeTypes.has(file.mimetype)) {
    return callback(null, true);
  }

  const error = new Error('Only JPEG, PNG, and WEBP images are allowed.');
  error.statusCode = 400;
  return callback(error, false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: maxFileSize,
  },
});

const uploadSingle = (fieldName) => upload.single(fieldName);
const uploadMultiple = (fieldName) => upload.array(fieldName, 5);

module.exports = {
  uploadSingle,
  uploadMultiple,
};
