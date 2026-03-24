function devAuth(req, res, next) {
  const secret = req.headers['x-admin-secret']; // client must send this
  if (secret === process.env.ADMIN_SECRET) {
    return next(); // ✅ allow
  } else {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
}

module.exports = devAuth;
