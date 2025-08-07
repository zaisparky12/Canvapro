require('dotenv').config();

module.exports = function adminAuth(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ message: 'Unauthorized' });

  // Basic token check (could be improved with JWT)
  if (authorization === `Bearer ${process.env.ADMIN_PASSWORD}`) {
    return next();
  }
  return res.status(401).json({ message: 'Invalid credentials' });
};