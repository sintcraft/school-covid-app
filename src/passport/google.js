const google = require('passport-google-oauth20');

const Strategy = new google.Strategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.mainUrl+'/auth/google/callback'
      },
      function(accessToken, refreshToken, profile, done) {
         console.log(profile);
         return done(null, profile);
      }
);

module.exports = Strategy;