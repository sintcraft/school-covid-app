
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
   let post_liked = document.getElementById('postId')
   setTimeout(function(){
      socket.emit('like', {
         postId
      })
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