const express = require('express');
const router = express.Router();
const authRoutes = require('./auth');
const userRoutes = require('./user');
const adminQuestionRoutes = require('./adminQuestion');
const userQuestionRoutes = require('./userQuestion');
const { isAuthenticated } = require('../middlewares/index');

router.use('/auth', authRoutes);
router.use('/api/admin/question', adminQuestionRoutes);
router.use('/api/question', userQuestionRoutes);
router.use('/api/user', userRoutes);

router.use('*', (req, res) => {
  res.status(404).json({message: 'Not found'});
});

module.exports = router;

