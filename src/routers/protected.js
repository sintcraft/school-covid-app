const express = require('express');
const router = express.Router();
const passport = require('../passport/passport')

router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }), (req, res) => {
   res.send('hi')
});
router.get('/auth/google/callback', passport.authenticate('google'), (req, res) => {
   res.redirect('/')
});

router.get('/perfil', passport.authenticate('google'), (req, res) => {
   res.send('user');
});

router.get('/config', (req, res) => {
   res.send('config');
});

module.exports = router;