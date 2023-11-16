const express = require('express');
// const session = require('express-session');
// const passport = require('passport');
const cors = require("cors")
const router = require('./routes');
const app = express();
const port = process.env.PORT || 3000;

require('./config/db');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({
  origin: '*',
  credentials: true
}));

// app.use(
//   session({
//     name: 'app-auth',
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// // Initialize Passport
// app.use(passport.initialize());
// app.use(passport.session());

app.use('/', router);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
