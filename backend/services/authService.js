const bcrypt = require('bcrypt');
const appConfig = require('../config/app');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
  getRefreshTokenExpiryDate,
} = require('../helpers/jwtHelper');
const { AppError } = require('../helpers/errorHelper');
const { normalizeEmail, normalizeNullableText, slugify } = require('../helpers/stringHelper');
const databaseRepository = require('../repositories/databaseRepository');
const roleRepository = require('../repositories/roleRepository');
const userRepository = require('../repositories/userRepository');
const storeRepository = require('../repositories/storeRepository');
const refreshTokenRepository = require('../repositories/refreshTokenRepository');

const ROLE_IDS = {
  seller: 2,
};
const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

const buildTokenPayload = (user, storeId = null) => ({
  id: user.id,
  email: user.email,
  role_id: user.role_id,
  ...(storeId ? { store_id: storeId } : {}),
});

const buildTokenPair = (user, storeId = null) => {
  const payload = buildTokenPayload(user, storeId);
  const accessToken = generateAccessToken(payload);
  return {
    token: accessToken,
    accessToken,
    refreshToken: generateRefreshToken(payload),
  };
};

const persistRefreshToken = async (connection, { userId, refreshToken, userAgent, ipAddress }) => {
  await refreshTokenRepository.create(connection, {
    user_id: userId,
    token_hash: hashToken(refreshToken),
    expires_at: getRefreshTokenExpiryDate(),
    user_agent: userAgent,
    ip_address: ipAddress,
  });
};

const buildUploadPath = (file) => {
  if (!file) {
    return undefined;
  }

  const configuredUploadDir = appConfig.uploadDir || process.env.UPLOAD_DIR || 'uploads/';
  const publicUploadDir = configuredUploadDir.replace(/\\/g, '/').replace(/\/?$/, '/');
  return `${publicUploadDir}${file.filename}`;
};

const attachStoreIfSeller = async (user) => {
  if (!user) {
    return null;
  }

  const store = user.role_id === ROLE_IDS.seller ? await storeRepository.findByUserId(user.id) : null;
  return { ...user, store };
};

const register = async (payload, metadata = {}) => {
  const email = normalizeEmail(payload.email);
  const existingUser = await userRepository.findIdByEmail(email);

  if (existingUser) {
    throw new AppError('Email is already registered.', 409);
  }

  const role = await roleRepository.findByName(payload.role);

  if (!role) {
    throw new AppError('Selected role is not available.', 400);
  }

  const hashedPassword = await bcrypt.hash(payload.password, BCRYPT_SALT_ROUNDS);

  const result = await databaseRepository.withTransaction(async (connection) => {
    const userId = await userRepository.create(connection, {
      name: payload.name,
      email,
      password: hashedPassword,
      role_id: role.id,
    });

    let store = null;

    if (role.id === ROLE_IDS.seller) {
      const storeName = normalizeNullableText(payload.store_name) || payload.name;
      const storeSlug = `${slugify(storeName) || String(userId)}-${userId}`;
      const storeId = await storeRepository.create(connection, {
        user_id: userId,
        store_name: storeName,
        slug: storeSlug,
        description: normalizeNullableText(payload.description),
      });

      store = {
        id: storeId,
        store_name: storeName,
        slug: storeSlug,
      };
    }

    const user = {
      id: userId,
      name: payload.name,
      email,
      role_id: role.id,
      role: role.name,
      is_active: true,
    };

    return { user, store };
  });

  const tokens = buildTokenPair(result.user, result.store?.id);

  await databaseRepository.withTransaction(async (connection) => {
    await persistRefreshToken(connection, {
      userId: result.user.id,
      refreshToken: tokens.refreshToken,
      userAgent: metadata.userAgent,
      ipAddress: metadata.ipAddress,
    });
  });

  return { ...tokens, user: { ...result.user, store: result.store } };
};

const login = async (payload, metadata = {}) => {
  const email = normalizeEmail(payload.email);
  const user = await userRepository.findByEmail(email);

  if (!user || !user.is_active) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password.', 401);
  }

  const store = user.role_id === ROLE_IDS.seller ? await storeRepository.findByUserId(user.id) : null;
  const tokens = buildTokenPair(user, store?.id);
  const { password, ...safeUser } = user;

  await databaseRepository.withTransaction(async (connection) => {
    await persistRefreshToken(connection, {
      userId: user.id,
      refreshToken: tokens.refreshToken,
      userAgent: metadata.userAgent,
      ipAddress: metadata.ipAddress,
    });
  });

  return { ...tokens, user: { ...safeUser, store } };
};


const refresh = async ({ refreshToken, metadata = {} }) => {
  if (!refreshToken) {
    throw new AppError('Refresh token is required.', 401);
  }

  try {
    verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new AppError('Invalid refresh token.', 401);
  }

  const tokenHash = hashToken(refreshToken);
  const storedToken = await refreshTokenRepository.findActiveByHash(tokenHash);

  if (!storedToken || !storedToken.is_active) {
    throw new AppError('Invalid refresh token.', 401);
  }

  const user = await userRepository.findPublicById(storedToken.user_id);
  if (!user || !user.is_active) {
    throw new AppError('Invalid refresh token.', 401);
  }

  const store = user.role_id === ROLE_IDS.seller ? await storeRepository.findByUserId(user.id) : null;
  const tokens = buildTokenPair(user, store?.id);

  await databaseRepository.withTransaction(async (connection) => {
    await refreshTokenRepository.revokeByHash(connection, tokenHash);
    await persistRefreshToken(connection, {
      userId: user.id,
      refreshToken: tokens.refreshToken,
      userAgent: metadata.userAgent,
      ipAddress: metadata.ipAddress,
    });
  });

  return { ...tokens, user: { ...user, store } };
};

const logout = async ({ userId, refreshToken }) => {
  await databaseRepository.withTransaction(async (connection) => {
    if (refreshToken) {
      await refreshTokenRepository.revokeByHash(connection, hashToken(refreshToken));
      return;
    }

    if (userId) {
      await refreshTokenRepository.revokeAllForUser(connection, userId);
    }
  });

  return null;
};

const getMe = async (userId) => {
  const user = await userRepository.findPublicById(userId);

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  return { user: await attachStoreIfSeller(user) };
};

const updateProfile = async ({ userId, payload, file }) => {
  const user = await userRepository.findPublicById(userId);

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  const avatar = buildUploadPath(file);
  const userFields = {};

  if (payload.name !== undefined) userFields.name = payload.name;
  if (payload.phone !== undefined) userFields.phone = normalizeNullableText(payload.phone);
  if (avatar !== undefined) userFields.avatar = avatar;

  const storeFields = {};

  if (user.role_id === ROLE_IDS.seller) {
    ['store_name', 'description', 'address', 'city', 'province', 'postal_code'].forEach((field) => {
      if (payload[field] !== undefined) {
        storeFields[field] = normalizeNullableText(payload[field]);
      }
    });
  }

  if (Object.keys(userFields).length === 0 && Object.keys(storeFields).length === 0) {
    throw new AppError('No profile fields were provided.', 400);
  }

  await databaseRepository.withTransaction(async (connection) => {
    await userRepository.updateProfile(connection, userId, userFields);

    if (Object.keys(storeFields).length > 0) {
      const existingStore = await storeRepository.findIdByUserId(connection, userId);

      if (existingStore) {
        await storeRepository.updateByUserId(connection, userId, storeFields);
        return;
      }

      const fallbackStoreName = storeFields.store_name || userFields.name || user.name;
      await storeRepository.create(connection, {
        user_id: userId,
        store_name: fallbackStoreName,
        slug: `${slugify(fallbackStoreName) || String(userId)}-${userId}`,
        description: storeFields.description,
        address: storeFields.address,
        city: storeFields.city,
        province: storeFields.province,
        postal_code: storeFields.postal_code,
      });
    }
  });

  const updatedUser = await userRepository.findPublicById(userId);
  return { user: await attachStoreIfSeller(updatedUser) };
};

const changePassword = async ({ userId, currentPassword, newPassword }) => {
  const user = await userRepository.findPasswordById(userId);

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordValid) {
    throw new AppError('Current password is incorrect.', 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
  await userRepository.updatePassword(userId, hashedPassword);

  return null;
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  refresh,
  logout,
  changePassword,
};
