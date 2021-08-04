const Posts = require('./models/post')
const Likes = require('./models/likes')
module.exports = {
   start: function(io, session){
      io.on('connection', async function(socket){
         let likes = await Likes.find({ userId: socket.request.user.userId })
         socket.emit('credentials', {
            avatar: socket.request.user.avatar,
            username: socket.request.user.username,
            displayName: socket.request.user.displayName,
            userId: socket.request.user.userId,
            likes: likes,
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
            io.emit('newPost', {
               content: post.content,
               pdisplayName: socket.request.user.displayName,
               pusername: socket.request.user.username,
               pavatar: socket.request.user.avatar,
               plikes: 0,
               p_id: post._id,
               ptimeStamp: post.timeStamp,
            })
         })
         
         socket.on('like', async({
            postId,
         }) => {
            if(!socket.request.user || !postId)return
            let postd = await Posts.findOne({ _id: postId })
            let liked = await Likes.findOne({ postId })
            if(!liked && postd != null){
               postd.likes++
               await postd.save()
               let like = new Likes()
               like.postId = postId
               like.userId = socket.request.user.userId
               like.timeStamp = Date.now()
               await like.save()
            }
         })
         socket.on('rlike', async({
            postId,
         }) => {
            if(!socket.request.user || !postId)return
            let postd = await Posts.findOne({ _id: postId })
            let data = await Likes.findOne({ postId })
            if(data && postd){
               await data.remove()
               postd.likes--
               await postd.save()
            }
         })
      });
   }
}