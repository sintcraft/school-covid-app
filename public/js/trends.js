const socket = io('', {
   transports: ['polling']
});


//global variables
var lastPostTime = 1826660443711
var lastId = 0;
var loadPostsTimeout = false;


// credentians
var avatar
var username
var displayName
var logros
var userId
socket.on('credentials', (data) => {
   avatar = data.avatar;
   username = data.username;
   if(data.displayName.length > 12){
      displayName = data.displayName.slice(0, 12) + '..';
   } else {
      displayName = data.displayName;
   }
   logros = data.logros;
});



async function loadPosts(){
   if(loadPostsTimeout)return
   else{
      loadPostsTimeout = true;
   }
   let highScroll = document.documentElement.scrollTop;
   let lastPostElement = document.getElementById(lastId);
   if(lastPostElement && lastPostElement.offsetTop - (lastPostElement.offsetHeight*7) == highScroll)return

   let data = await fetch(`api/posts?cant=10&lastQuerry=${lastPostTime}&type=trends`)
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
            <div class="harth"><i class="far fa-heart" onclick="like("${ post._id }")"></i> ${ post.likes }</div>
         </div>
      `
   }
   setTimeout(() => { loadPostsTimeout = false; }, 1000);
   document.getElementById('posts').innerHTML = new_posts;
}


//Initialize
loadPosts();

window.addEventListener('scroll', loadPosts)