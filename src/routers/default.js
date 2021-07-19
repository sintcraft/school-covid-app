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

router.get('/home', async(req, res) => {
   if(req.user.new)return res.redirect('/new-user');
   const posts = await Posts.find().sort({ timeStamp: "desc"})
   res.render('pages/home', {
      posts: posts,
      user: req.user,
   });
});

router.get('/new-user', async(req, res) => {
   if(!req.user.new)return res.redirect('/home');
   req.user.new = false;
   await req.user.save();
   res.render('pages/new-user');
});



module.exports = router;