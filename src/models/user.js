const mongoose = require('mongoose');
const Schema = new mongoose.Schema({
   userId: {
      type: String,
      required: true,
   },
   username: {
      type: String,
   },
   displayName: {
      type: String,
   },
   logros: {
      type: Array,
      default: [],
   },
   avatar: {
      type: String,
   },
   new: {
      type: Boolean,
      default: true,
   },
});

module.exports = mongoose.model('users', Schema);