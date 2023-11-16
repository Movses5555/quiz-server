
const { User } = require('../models');

// Get User controller
const GetUser = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    throw error;
  }
};
// const GetUser = async (req, res) => {
//   try {
//     if(!req.user || !req.user?.id) {
//       return res.status(404).json({ message: 'Access denied.' });
//     }
//     const user = await User.findOne({ _id: req.user?.id });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found.' });
//     }
//     const data = {
//       _id: user._id,
//       username: user.username,
//       createdAt: user.createdAt,
//     };
//     res.status(200).json({...data});
//   } catch (error) {
//     throw error;
//   }
// };

module.exports = {
  GetUser,
};
