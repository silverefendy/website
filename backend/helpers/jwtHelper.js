const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const appConfig = require('../config/app');

const ACCESS_TOKEN_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';
const REFRESH_TOKEN_TTL_DAYS = Number(process.env.JWT_REFRESH_TTL_DAYS) || 7;

const signToken = (payload, expiresIn, tokenType) => {
  return jwt.sign({ ...payload, token_type: tokenType }, appConfig.jwt.secret, { expiresIn });
};

const generateAccessToken = (payload) => signToken(payload, ACCESS_TOKEN_EXPIRES_IN, 'access');
const generateRefreshToken = (payload) => signToken({ ...payload, jti: crypto.randomUUID() }, REFRESH_TOKEN_EXPIRES_IN, 'refresh');

const verifyToken = (token) => jwt.verify(token, appConfig.jwt.secret);

const verifyAccessToken = (token) => {
  const decoded = verifyToken(token);
  if (decoded.token_type !== 'access') {
    throw new Error('Invalid token type.');
  }
  return decoded;
};

const verifyRefreshToken = (token) => {
  const decoded = verifyToken(token);
  if (decoded.token_type !== 'refresh') {
    throw new Error('Invalid token type.');
  }
  return decoded;
};

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const getRefreshTokenExpiryDate = () => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_TTL_DAYS);
  return expiresAt;
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  verifyToken,
  hashToken,
  getRefreshTokenExpiryDate,
};
