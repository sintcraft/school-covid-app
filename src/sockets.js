const Posts = require('./models/post')
module.exports = {
   start: function(io, session){
      io.on('connection', async function(socket){
         //console.log(socket.request.user);
         socket.emit('credentials', {
            avatar: socket.request.user.avatar,
            username: socket.request.user.username,
            displayName: socket.request.user.displayName,
            userId: socket.request.user.userId,
         });
         socket.on('post', async ({ content }) => {
            if(!socket.request.user || content.length > 2000 || content.length <= 1){
               socket.emit('errorPost', { message: 'Invalid post' })
               return
            };
            post.content = content
            post.authorId = socket.request.user.userId
            post.timeStamp = new Date().getTime()
            await post.save()
            socket.broadcast.emit('newPost', {
               content: post.content,
               pdisplayName: socket.request.user.displayName,
               pusername: socket.request.user.username,
               pavatar: socket.request.user.avatar,
               plikes: 0,
            })
         })
      });
   }
}