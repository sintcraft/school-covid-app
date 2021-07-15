const passport = require('passport');
const google = require('passport-google-oauth20');
const User = require('../models/user');
module.exports = () => {
   passport.serializeUser((user, done) => {
      done(null, user.userId);
   })
   passport.deserializeUser(async(id, done) => {
      let data = await User.findOne({ userId: id })
      if(!data) {
         done(null, false);
      }else{
         done(null, data);
      }
   })
      
   passport.use(new google.Strategy({
         clientID: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
         callbackURL: process.env.mainUrl+'/auth/google/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
         let user = await User.findOne({'userId': profile.id})
         if(!user) {
            user = new User()
            user.userId = profile.id;
            user.username = profile.id;
            user.displayName = profile.displayName;
            user.avatar = profile.photos[0].value;
            await user.save();
            return done(null, user)
         }else{
            return done(null, user)
         }
      }
   ));
}