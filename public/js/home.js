
socket.on('newPost', (data) =>{
   insertPost({
      content: data.content,
      pdisplayName: data.pdisplayName,
      pusername: data.pusername,
      pavatar: data.pavatar,
      plikes: data.plikes,
      ptimeStamp: data.ptimeStamp,
      p_id: data.p_id,
   })
})

const onPostUpdate = () => {
   let post_content = document.getElementById('post-content');
   post_content.rows = resolveRowsNumber(post_content.value, 44);
}

const sendPost = () => {
   let content = document.getElementById('post-content').value;
   document.getElementById('post-content').value = '';
   if(content.length <= 1 || content.length > 2000){
      document.getElementById('errorBoxPost').innerHTML = 'Texto invalido'
      setTimeout(() => {
         document.getElementById('errorBoxPost').innerHTML = '';
      }, 3000)
      return
   }
   socket.emit('post', {
      content
   });
}
socket.on('errorPost', ({ message }) => {
   document.getElementById('errorBoxPost').innerHTML = message;
});

function newPostLayout(){
   document.getElementById('post-content').focus();
   let newPost = document.getElementById('newPost');
   newPost.style = 'box-shadow: 0 0 1em #0a0;';
   setTimeout(() => {
      newPost.style = 'box-shadow: none;';
   }, 500);
}

async function loadPosts(){
   if(loadPostsTimeout || !arraylikes){
      setTimeout(() => {
         loadPosts();
      }, 200);
      return
   }
   else{
      loadPostsTimeout = true;
   }
   let highScroll = document.documentElement.scrollTop;
   let lastPostElement = document.getElementById(lastId);
   if(lastPostElement && lastPostElement.offsetTop - (lastPostElement.offsetHeight*7) == highScroll)return

   let data = await fetch(`api/posts?cant=10&lastQuerry=${lastPostTime}&type=time`)
   .then(response => response.json())
   .then(json => {return json});
   if(data.status != 200)return;
   if(data.data.length == 0)return;

   let new_posts = document.getElementById('posts').innerHTML;
   for(let i = 0 ; i < data.data.length ; i++){
      let post = data.data[i].post;
      let author = data.data[i].author;
      if(author.displayName.length > 12){
         author.displayName = author.displayName.slice(0, 12) + '..';
      }
      lastPostTime = post.timeStamp;
      lastId = post._id;
      new_posts += `
         <div class="post" id="${ post._id }">
            <div class="data">
               <img src="${ author.avatar }" alt="" class="userAvatar">
               <p class="displayName">${ author.displayName }</p>
               <a class="username" href="/u/${ author.username }">@${ author.username }</a>
               <i class="far fa-circle"></i>
               <p class="timeStap">${timeDifference(Date.now(), post.timeStamp)}</p>
            </div>
            <textarea class="content" id="post" readonly="true" onclick="openPost('${ post._id }')" rows="${ resolveRowsNumber(post.content) }">${ post.content }</textarea>
            <div class="harth" onclick="likePost('${ post._id }')"><i class="fa fa-heart" id="like${ post._id }"></i> <p id="likenumber${ post._id }">${ post.likes }</p></div>
         </div>
      `
   }
   setTimeout(() => { loadPostsTimeout = false; }, 1000);
   document.getElementById('posts').innerHTML = new_posts;
}

function insertPost({
   content,
   pdisplayName,
   pusername,
   pavatar,
   plikes,
   ptimeStamp,
   p_id,
}){
   if(!pdisplayName) pdisplayName = displayName;
   if(!pusername) pusername = username;
   if(!pavatar) pavatar = avatar;
   if(!plikes) plikes = 0;
   if(!ptimeStamp) ptimeStamp = Date.now();
   if(!p_id)return;
   let new_post = `
   <div class="post postNow" id="${p_id}">
      <div class="data">
         <img src="${ pavatar }" alt="" class="userAvatar">
         <p class="displayName">${ pdisplayName }</p>
         <a class="username" href="/u/${ pusername }">@${ pusername }</a>
         <i class="far fa-circle"></i>
         <p class="timeStap">${timeDifference(Date.now(), Date.now() - 1000)}</p>
      </div>
      <textarea class="content" id="post" readonly="true" onclick="openPost('${ p_id }')" rows="${ resolveRowsNumber(content) }">${ content }</textarea>
      <div class="harth" onclick="likePost('${ p_id }')"><i class="fa fa-heart" id="like${ p_id }"></i> <p id="likenumber${ p_id }">${ plikes }</p></div>
   </div>
   `
   document.getElementById('posts').innerHTML = new_post+ document.getElementById('posts').innerHTML;
   document.getElementById('post-content').rows = 1;
   setTimeout(() => {
      for(let e of document.querySelectorAll('.postNow')){
         e.classList.remove('postNow');
      }
   }, 500)
}



//Initialize
loadPosts();

window.addEventListener('scroll', loadPosts)