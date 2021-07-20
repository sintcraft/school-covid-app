const config = require('../config.json');
const mongoose = require('mongoose');

function iniciarConexion() {
   let mongoURI = process.env.mongoURI || config.mongoURI;
   if(!mongoURI){
      console.log('Mongo URI not found')
   }
   mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
         console.log('[DB] ready');
      })
      .catch(err => {
         console.log('[DB] error', err);
      })
}

module.exports = {
   iniciarConexion
};