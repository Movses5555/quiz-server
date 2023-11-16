const User = require("../models/user");
const jwt = require("jsonwebtoken");


const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const username = decoded.username;
    const user = await User.findOne({ username });
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = {
  isAuthenticated,
}
