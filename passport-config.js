const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('./models/user');

passport.use(new LocalStrategy((username, password, done) => {
  // Check if it's the admin
  if (username === 'Admin' && password === 'admin') {
    return done(null, { _id: 'admin', username: 'Admin' });
  }

  // Check regular users
  User.findOne({ username: username }, (err, user) => {
    if (err) return done(err);
    if (!user) return done(null, false, { message: 'Incorrect username.' });
    if (user.password !== password) return done(null, false, { message: 'Incorrect password.' });
    return done(null, user);
  });
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  if (id === 'admin') {
    return done(null, { _id: 'admin', username: 'Admin' });
  }

  User.findById(id, (err, user) => {
    done(err, user);
  });
});
