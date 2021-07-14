const passport = require('passport');
const googleStrategy = require('./google')

passport.use(googleStrategy);

passport.serializeUser(function(user, done) {
   done(null, user);
});

passport.deserializeUser(function(user, done) {
   done(null, user);
});

module.exports = passport;