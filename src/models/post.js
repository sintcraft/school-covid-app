const mongoose = require('mongoose')
const Schema = new mongoose.Schema({
   authorId: {
      type: String,
      required: true
   },
   content: {
      type: String,
      required: true
   },
   timeStamp: {
      type: Number,
   },
   likes: {
      type: Number,
      default: 0
   },
   referenceId: {
      type: String,
      default: null,
   }
})

module.exports = mongoose.model('posts', Schema)