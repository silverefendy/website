const bcrypt = require('bcrypt');
const db = require('../config/db');
const appConfig = require('../config/app');
const { generateToken } = require('../helpers/jwtHelper');
const { successResponse, errorResponse } = require('../helpers/responseHelper');

const ROLE_NAMES = {
  seller: 'seller',
  customer: 'customer',
};

const ROLE_IDS = {
  seller: 2,
};

const PASSWORD_MIN_LENGTH = 8;
const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const normalizeText = (value) => {
  if (value === undefined || value === null) {
    return undefined;
  }

  return String(value).trim();
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const slugify = (value) => {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const getUploadPath = (file) => {
  if (!file) {
    return undefined;
  }

  const configuredUploadDir = appConfig.uploadDir || process.env.UPLOAD_DIR || 'uploads/';
  const publicUploadDir = configuredUploadDir.replace(/\\/g, '/').replace(/\/?$/, '/');

  return `${publicUploadDir}${file.filename}`;
};

const buildTokenPayload = (user, storeId = null) => ({
  id: user.id,
  email: user.email,
  role_id: user.role_id,
  ...(storeId ? { store_id: storeId } : {}),
});

const getStoreByUserId = async (userId) => {
  try {
    const [stores] = await db.execute(
      'SELECT id, store_name, slug, description, logo, banner, address, city, province, postal_code, is_active FROM stores WHERE user_id = ? LIMIT 1',
      [userId],
    );

    return stores[0] || null;
  } catch (error) {
    throw error;
  }
};

const getUserById = async (userId) => {
  try {
    const [users] = await db.execute(
      `SELECT users.id, users.name, users.email, users.phone, users.avatar, users.role_id,
              roles.name AS role, users.is_active, users.email_verified_at, users.created_at, users.updated_at
       FROM users
       INNER JOIN roles ON roles.id = users.role_id
       WHERE users.id = ?
       LIMIT 1`,
      [userId],
    );

    return users[0] || null;
  } catch (error) {
    throw error;
  }
};

const register = async (req, res) => {
  let connection;

  try {
    const name = normalizeText(req.body.name);
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || '');
    const role = normalizeText(req.body.role)?.toLowerCase();

    const errors = {};

    if (!name) {
      errors.name = 'Name is required.';
    }

    if (!email || !isValidEmail(email)) {
      errors.email = 'A valid email is required.';
    }

    if (!password || password.length < PASSWORD_MIN_LENGTH) {
      errors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
    }

    if (![ROLE_NAMES.seller, ROLE_NAMES.customer].includes(role)) {
      errors.role = 'Role must be seller or customer.';
    }

    if (Object.keys(errors).length > 0) {
      return errorResponse(res, 'Validation failed.', 422, errors);
    }

    const [existingUsers] = await db.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);

    if (existingUsers.length > 0) {
      return errorResponse(res, 'Email is already registered.', 409);
    }

    const [roles] = await db.execute('SELECT id, name FROM roles WHERE name = ? LIMIT 1', [role]);

    if (roles.length === 0) {
      return errorResponse(res, 'Selected role is not available.', 400);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    connection = await db.getConnection();
    await connection.beginTransaction();

    const [userResult] = await connection.execute(
      'INSERT INTO users (name, email, password, role_id, is_active) VALUES (?, ?, ?, ?, TRUE)',
      [name, email, hashedPassword, roles[0].id],
    );

    const userId = userResult.insertId;
    let store = null;

    if (roles[0].id === ROLE_IDS.seller) {
      const storeName = name;
      const storeSlug = `${slugify(storeName) || String(userId)}-${userId}`;

      const [storeResult] = await connection.execute(
        'INSERT INTO stores (user_id, store_name, slug, is_active) VALUES (?, ?, ?, TRUE)',
        [userId, storeName, storeSlug],
      );

      store = {
        id: storeResult.insertId,
        store_name: storeName,
        slug: storeSlug,
      };
    }

    await connection.commit();

    const user = {
      id: userId,
      name,
      email,
      role_id: roles[0].id,
      role: roles[0].name,
      is_active: true,
    };

    const token = generateToken(buildTokenPayload(user, store?.id));

    return successResponse(res, { token, user: { ...user, store } }, 'Registration successful.', 201);
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    return errorResponse(res, 'Unable to register user.', 500, process.env.NODE_ENV === 'development' ? error.message : null);
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

const login = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = String(req.body.password || '');

    const errors = {};

    if (!email || !isValidEmail(email)) {
      errors.email = 'A valid email is required.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    }

    if (Object.keys(errors).length > 0) {
      return errorResponse(res, 'Validation failed.', 422, errors);
    }

    const [users] = await db.execute(
      `SELECT users.id, users.name, users.email, users.password, users.phone, users.avatar,
              users.role_id, roles.name AS role, users.is_active
       FROM users
       INNER JOIN roles ON roles.id = users.role_id
       WHERE users.email = ?
       LIMIT 1`,
      [email],
    );

    if (users.length === 0 || !users[0].is_active) {
      return errorResponse(res, 'Invalid email or password.', 401);
    }

    const user = users[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return errorResponse(res, 'Invalid email or password.', 401);
    }

    const store = user.role_id === ROLE_IDS.seller ? await getStoreByUserId(user.id) : null;
    const token = generateToken(buildTokenPayload(user, store?.id));

    delete user.password;

    return successResponse(res, { token, user: { ...user, store } }, 'Login successful.');
  } catch (error) {
    return errorResponse(res, 'Unable to login.', 500, process.env.NODE_ENV === 'development' ? error.message : null);
  }
};

const getMe = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);

    if (!user) {
      return errorResponse(res, 'User not found.', 404);
    }

    const store = user.role_id === ROLE_IDS.seller ? await getStoreByUserId(user.id) : null;

    return successResponse(res, { user: { ...user, store } }, 'Current user retrieved.');
  } catch (error) {
    return errorResponse(res, 'Unable to retrieve current user.', 500, process.env.NODE_ENV === 'development' ? error.message : null);
  }
};

const updateProfile = async (req, res) => {
  let connection;

  try {
    const userId = req.user.id;
    const user = await getUserById(userId);

    if (!user) {
      return errorResponse(res, 'User not found.', 404);
    }

    const userFields = {};
    const avatar = getUploadPath(req.file);

    if (req.body.name !== undefined) {
      const name = normalizeText(req.body.name);

      if (!name) {
        return errorResponse(res, 'Validation failed.', 422, { name: 'Name cannot be empty.' });
      }

      userFields.name = name;
    }

    if (req.body.phone !== undefined) {
      userFields.phone = normalizeText(req.body.phone) || null;
    }

    if (avatar !== undefined) {
      userFields.avatar = avatar;
    }

    const storeInputFields = ['store_name', 'description', 'address', 'city', 'province', 'postal_code'];
    const storeFields = {};

    if (user.role_id === ROLE_IDS.seller) {
      for (const field of storeInputFields) {
        if (req.body[field] !== undefined) {
          const value = normalizeText(req.body[field]);

          if (field === 'store_name' && !value) {
            return errorResponse(res, 'Validation failed.', 422, { store_name: 'Store name cannot be empty.' });
          }

          storeFields[field] = value || null;
        }
      }
    }

    if (Object.keys(userFields).length === 0 && Object.keys(storeFields).length === 0) {
      return errorResponse(res, 'No profile fields were provided.', 400);
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    if (Object.keys(userFields).length > 0) {
      const assignments = Object.keys(userFields).map((field) => `${field} = ?`).join(', ');
      const values = [...Object.values(userFields), userId];

      await connection.execute(`UPDATE users SET ${assignments} WHERE id = ?`, values);
    }

    if (Object.keys(storeFields).length > 0) {
      const [stores] = await connection.execute('SELECT id FROM stores WHERE user_id = ? LIMIT 1', [userId]);

      if (stores.length === 0) {
        const fallbackStoreName = storeFields.store_name || userFields.name || user.name;
        const fallbackSlug = `${slugify(fallbackStoreName) || String(userId)}-${userId}`;

        await connection.execute(
          'INSERT INTO stores (user_id, store_name, slug, description, address, city, province, postal_code, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE)',
          [
            userId,
            fallbackStoreName,
            fallbackSlug,
            storeFields.description || null,
            storeFields.address || null,
            storeFields.city || null,
            storeFields.province || null,
            storeFields.postal_code || null,
          ],
        );
      } else {
        const assignments = Object.keys(storeFields).map((field) => `${field} = ?`).join(', ');
        const values = [...Object.values(storeFields), userId];

        await connection.execute(`UPDATE stores SET ${assignments} WHERE user_id = ?`, values);
      }
    }

    await connection.commit();

    const updatedUser = await getUserById(userId);
    const store = updatedUser.role_id === ROLE_IDS.seller ? await getStoreByUserId(userId) : null;

    return successResponse(res, { user: { ...updatedUser, store } }, 'Profile updated successfully.');
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    return errorResponse(res, 'Unable to update profile.', 500, process.env.NODE_ENV === 'development' ? error.message : null);
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

const changePassword = async (req, res) => {
  try {
    const currentPassword = String(req.body.current_password || '');
    const newPassword = String(req.body.new_password || '');
    const confirmPassword = String(req.body.confirm_password || '');
    const errors = {};

    if (!currentPassword) {
      errors.current_password = 'Current password is required.';
    }

    if (!newPassword || newPassword.length < PASSWORD_MIN_LENGTH) {
      errors.new_password = `New password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
    }

    if (newPassword !== confirmPassword) {
      errors.confirm_password = 'Password confirmation does not match.';
    }

    if (Object.keys(errors).length > 0) {
      return errorResponse(res, 'Validation failed.', 422, errors);
    }

    const [users] = await db.execute('SELECT id, password FROM users WHERE id = ? LIMIT 1', [req.user.id]);

    if (users.length === 0) {
      return errorResponse(res, 'User not found.', 404);
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, users[0].password);

    if (!isPasswordValid) {
      return errorResponse(res, 'Current password is incorrect.', 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);

    await db.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);

    return successResponse(res, null, 'Password changed successfully.');
  } catch (error) {
    return errorResponse(res, 'Unable to change password.', 500, process.env.NODE_ENV === 'development' ? error.message : null);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
};
