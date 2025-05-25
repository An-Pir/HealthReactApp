// middleware/auth.js
const jwt = require('jsonwebtoken');

/**
 * Проверяет наличие и валидность JWT в заголовке Authorization.
 * При удачной верификации выставляет в req:
 *   req.userId   — ID пользователя из payload
 *   req.userRole — роль пользователя из payload
 */
function verifyToken(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ message: 'Токен не передан' });
    }

    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Неправильный формат токена' });
    }

    // Если токен просрочен или неверен — jwt.verify выбросит ошибку
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // payload = { userId, role, iat, exp }
    req.userId   = payload.userId;
    req.userRole = payload.role;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Токен просрочен' });
    }
    return res.status(403).json({ message: 'Невалидный токен' });
  }
}

/**
 * Проверяет, что у авторизованного пользователя роль === 'admin'
 * Должен вызываться после verifyToken
 */
function isAdmin(req, res, next) {
  if (req.userRole !== 'admin') {
    return res.status(403).json({ message: 'Требуется роль admin' });
  }
  next();
}

//  «мягкий» разбор токена
function verifyTokenOptional(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return next();

  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return next();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId   = payload.userId;
    req.userRole = payload.role;
  } catch (e) {
    // игнорируем ошибку: невалидный или просроченный токен
  }
  next();
}

module.exports = { verifyToken, verifyTokenOptional, isAdmin };