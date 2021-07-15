const mongoose = require('mongoose');

function iniciarConexion() {
   mongoose.connect(process.env.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
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