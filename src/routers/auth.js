const express = require('express');
const router = express.Router();
const passport = require('passport')

router.get('/google', dontAuthenticated ,passport.authenticate('google', { scope: ['profile'] }));
router.get('/google/callback', dontAuthenticated, passport.authenticate('google', { scope: ['profile'] }), (req, res) => {
   res.redirect('/')
})

router.get('/logout', (req, res) => {
   if(!req.isAuthenticated()) {
      res.redirect('/home');
   }
   req.logout();
   res.redirect('/');
})

function dontAuthenticated(req, res, next) {
   if(!req.isAuthenticated()) {
      next();
   }else{
      res.redirect('/home');
   }
}

module.exports = router;