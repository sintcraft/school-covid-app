const mongoose = require('mongoose');
const Schema = mongoose.Schema({
   userId: {
      type: String,
      required: true
   },
   postId: {
      type: String,
      required: true
   },
   timeStamp: {
      type: Number,
      required: true
   }
})

module.exports = mongoose.model('Likes', Schema);