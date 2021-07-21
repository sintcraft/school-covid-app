const express = require('express');
const router = express.Router();
const Posts = require('../models/post')
const User = require('../models/user')

//Middlwares
const isLogged = (req, res, next) => {
   if (req.isAuthenticated()) {
      return next();
   }
   res.redirect('/login');
}
const isDontLogged = (req, res, next) => {
   if (!req.isAuthenticated()) {
      return next();
   }
   res.redirect('/home');
}

router.get('/', (req, res) => {
   res.render('pages/default');
});

router.get('/login', isDontLogged, (req, res) => {
   res.render('pages/login');
})

router.use(isLogged)

//Routes protected by my middleware
router.get('/new-user', async(req, res) => {
   if(!req.user.new)return res.redirect('/home');
   req.user.new = false;
   await req.user.save();
   res.render('pages/new-user');
});

router.get('/home', async(req, res) => {
   if(req.user.new)return res.redirect('/new-user');
   res.render('pages/home', {
      user: req.user,
   });
});

router.get('/populars', async(req, res) => {
   if(req.user.new)return res.redirect('/new-user');
   res.render('pages/populars', {
      user: req.user,
   });
});

router.get('/trends', async(req, res) => {
   if(req.user.new)return res.redirect('/new-user');
   res.render('pages/trends', {
      user: req.user,
   });
});





module.exports = router;