
const { User } = require('../models');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

// User registration controller
const Register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({
      username,
      password: hashedPassword,
    });
    await newUser.save();

    const payload = {
      username: newUser.username,
      password: newUser.password,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5d' });
    res.status(201).json({
      message: 'Registration successful',
      user: newUser,
      token
    });
  } catch (error) {
    throw error;
  }
};

// User login controller
const Login = async (req, res) => {
  const { username, password } = req.body;
  
  const user = await User.findOne({ username });
    
  if (!user) {
    return res.status(401).send({message: 'Invalid email or password'});
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  
  if (!isPasswordCorrect) {
    return res.status(401).send({message: 'Invalid email or password'});
  }
  const payload = {
    username: user.username,
    password: user.password,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5d' });
    

  if(username === 'Admin' && password === 'admin') {
    console.log('ADMIN');
    user.isAdmin = true;
    res.status(200).json({
      message: "Admin is logged in",
      token: token,
      user,
      isAdmin: true
    });
  } else {
    res.status(200).json({
      message: "User is logged in",
      token: token,
      user
    });
  }
};

// User logout controller
const Logout = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const { username, password } = decoded;
  const payload = { username, password };
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1' });
  res.status(200).json({ message: 'User logout successful' });
};

module.exports = {
  Register,
  Login,
  Logout,
};
