const Posts = require('./models/post')
const Likes = require('./models/likes')
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
            let post = new Posts()
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
         
         socket.on('like', async({
            postId,
         }) => {
            if(!socket.request.user || !postId)return
            let data = await Likes.findOne({ postId })
            if(!data){
               let like = new Likes()
               like.postId = postId
               like.userId = socket.request.user.userId
               await like.save()
               socket.broadcast.emit('newLike', {
                  postId: postId,
               })
            }else{
               data.delete()
            }
         })
      });
   }
}