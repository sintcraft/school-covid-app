const socket = io();


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
   console.log('awa')
   avatar = data.avatar;
   username = data.username;
   if(data.displayName.length > 12){
      displayName = data.displayName.slice(0, 12) + '..';
   } else {
      displayName = data.displayName;
   }
   logros = data.logros;
});

socket.on('newPost', (data) =>{
   console.log(data);
   insertPost({
      content: data.content,
      pdisplayName: data.pdisplayName,
      pusername: data.pusername,
      pavatar: data.pavatar,
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
   insertPost({
      content: content,
   });
   socket.emit('post', {
      content
   });
}
socket.on('errorPost', ({ message }) => {
   document.getElementById('errorBoxPost').innerHTML = message;
});

function timeDifference(current, previous) {
   var msPerMinute = 60 * 1000;
   var msPerHour = msPerMinute * 60;
   var msPerDay = msPerHour * 24;
   var msPerMonth = msPerDay * 30;
   var msPerYear = msPerDay * 365;
   var elapsed = current - previous;
   if (elapsed < msPerMinute) {
      return 'hace ' + Math.round(elapsed/1000) + ' segundos';   
   }
   else if (elapsed < msPerHour) {
      return 'hace ' + Math.round(elapsed/msPerMinute) + ' minutos';   
   }
   else if (elapsed < msPerDay ) {
      return 'hace ' + Math.round(elapsed/msPerHour ) + ' horas';   
   }
   else if (elapsed < msPerMonth) {
      return 'hace ' + Math.round(elapsed/msPerDay) + ' días';   
   }
   else if (elapsed < msPerYear) {
      return 'hace ' + Math.round(elapsed/msPerMonth) + ' meses';   
   }
   else {
      return 'hace ' + Math.round(elapsed/msPerYear ) + ' años';   
   }
}
function resolveRowsNumber(text, limit){
   if(!limit)limit = 73;
   let rows = text.split('\n').length;
   for(let row of text.split('\n')){
      if(row.length > 0){
         rows = rows + Math.floor(row.length/limit);
      }
   }
   return rows;
}

function newPostLayout(){
   document.getElementById('post-content').focus();
   let newPost = document.getElementById('newPost');
   newPost.style = 'box-shadow: 0 0 1em #0a0;';
   setTimeout(() => {
      newPost.style = 'box-shadow: none;';
   }, 500);
}

async function loadPosts(){
   if(loadPostsTimeout)return
   else{
      loadPostsTimeout = true;
   }
   console.log(loadPostsTimeout)
   let highScroll = document.documentElement.scrollTop;
   let lastPostElement = document.getElementById(lastId);
   if(lastPostElement && lastPostElement.offsetTop - (lastPostElement.offsetHeight*7) == highScroll)return

   let data = await fetch(`api/posts?cant=10&lastTime=${lastPostTime}`)
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
         <div class="post" onclick="openPost(${ post._id })" id="${ post._id }">
            <div class="data">
               <img src="${ author.avatar }" alt="" class="userAvatar">
               <p class="displayName">${ author.displayName }</p>
               <a class="username" href="/u/${ author.username }">@${ author.username }</a>
               <i class="far fa-circle"></i>
               <p class="timeStap">${timeDifference(Date.now(), post.timeStamp)}</p>
            </div>
            <textarea class="content" id="post" readonly="true" onclick="openPost(${ post._id })" rows="${ resolveRowsNumber(post.content) }">${ post.content }</textarea>
            <div class="harth" onclick="like(${ post._id })"><i class="far fa-heart"></i> ${ post.likes }</div>
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
}){
   console.log(pdisplayName,
      pusername,
      pavatar);
   if(!pdisplayName) pdisplayName = displayName;
   if(!pusername) pusername = username;
   if(!pavatar) pavatar = avatar;
   let new_post = `
   <div class="post postNow" onclick="openPost()">
      <div class="data">
         <img src="${ pavatar }" alt="" class="userAvatar">
         <p class="displayName">${ pdisplayName }</p>
         <a class="username" href="/u/${ pusername }">@${ pusername }</a>
         <i class="far fa-circle"></i>
         <p class="timeStap">${timeDifference(Date.now(), Date.now() - 1000)}</p>
      </div>
      <textarea class="content" id="post" readonly="true" rows="${ resolveRowsNumber(content) }">${ content }</textarea>
   </div>
   `
   document.getElementById('posts').innerHTML = new_post+ document.getElementById('posts').innerHTML;
   document.getElementById('post-content').rows = 1;
}



//Initialize
loadPosts();

window.addEventListener('scroll', loadPosts)