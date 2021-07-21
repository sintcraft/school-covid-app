const express = require('express');
const passport = require('passport');
const router = express.Router();
const Posts = require('../models/post')
const User = require('../models/user')

const isLogged = (req, res, next) => {
   if (req.isAuthenticated()) {
      return next();
   }
   res.redirect('/login');
}

router.get('/', (req, res) => {
   res.json({
      message: 'Hello from api'
   });
});

router.use(isLogged)

router.get('/posts/:id', async(req, res) => {
   let id = req.params.id
   let data = await Posts.findOne({ _id: id })
   if(!data){
      res.json({
         message: 'Post not found',
         status: 404
      })
   }
   res.json({
      data: data,
      status: 200
   })
});

router.get('/posts', async(req, res) => {
   let cantidad = parseInt(req.query.cantidad);
   let lastQuerry = parseInt(req.query.lastQuerry);
   let type = req.query.type;
   if(!cantidad || isNaN(cantidad) || cantidad > 15) cantidad = 10;
   if(!lastQuerry || isNaN(cantidad)) lastQuerry = 0;
   if(!type) type = 'time'
   var posts
   if(type == 'time'){
      posts = await Posts.find({ timeStamp: { $lt: lastQuerry } }).sort({ timeStamp: 'desc' }).limit(cantidad);
   }else if(type == 'likes'){
      posts = await Posts.find({ likes: { $lt: lastQuerry } }).sort({ likes: 'desc' }).limit(cantidad);
   }else if(type == 'trends'){
      posts = await Posts.find({ timeStamp: { $lt: lastQuerry } }).sort({ likes: 'desc' }).limit(cantidad);   
   }
   let data = [];
   for(let i = 0 ; i < posts.length ; i++){
      let user = await User.findOne({ userId: posts[i].authorId })
      data.push({
         post: posts[i],
         author: {
            username: user.username,
            displayName: user.displayName,
            avatar: user.avatar,
         },
      })
   }

   res.json({
      data: data,
      status: 200
   })
});


module.exports = router;