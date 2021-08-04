const socket = io('', {
   transports: ['polling']
});
//global variables
var lastPostTime = 1826660443711
var lastId = 0;
var loadPostsTimeout = false;
var arraylikes = null;


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
   arraylikes = data.likes;
});

function togleProfileSubmenu(){
   let profile_Submenu = document.getElementById('profile_Submenu')
   if(profile_Submenu.classList == 'hide'){
      profile_Submenu.classList.remove('hide')
   } else {
      profile_Submenu.classList.add('hide')
   }
}

function likePost(postId){
   console.log(postId)
   if(!postId)return
   let post_liked = document.getElementById('like'+postId)
   let post_likenumber = document.getElementById('likenumber'+postId)
   if(!post_liked ||  !post_likenumber)return
   if(post_liked.classList.contains('liked')){
      post_liked.classList.remove('liked')
      post_likenumber.innerHTML = parseInt(post_likenumber.innerHTML) - 1
   } else {
      post_liked.classList.add('liked')
      post_likenumber.innerHTML = parseInt(post_likenumber.innerHTML) + 1
   }
   setTimeout(function(){
      if(post_liked.classList.contains('liked')){
         socket.emit('like', {
            postId
         })
      }else{
         socket.emit('rlike', {
            postId
         })
      }
   }, 2000)
}

function openPost(){
   console.log('openPost')
}

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