const path = require('path');
const appConfig = require('../config/app');

const PUBLIC_UPLOAD_PATH = 'uploads';

const normalizeSlashes = (value) => String(value || '').replace(/\\/g, '/');

const resolveUploadDirectory = (uploadDir = appConfig.uploadDir) => {
  const configuredUploadDir = uploadDir || 'uploads';

  if (path.isAbsolute(configuredUploadDir)) {
    return configuredUploadDir;
  }

  return path.resolve(__dirname, '..', configuredUploadDir);
};

const buildPublicUploadPath = (file) => {
  if (!file?.filename) {
    return undefined;
  }

  return `${PUBLIC_UPLOAD_PATH}/${normalizeSlashes(file.filename).replace(/^\/+/, '')}`;
};

module.exports = {
  buildPublicUploadPath,
  resolveUploadDirectory,
};
