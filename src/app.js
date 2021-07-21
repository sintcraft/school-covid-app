require('dotenv').config();
const config = require('../config.json');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const socketio = require('socket.io');
const passportSocketIo = require('passport.socketio');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo').create({ mongoUrl: process.env.mongoURI });
const fs = require('fs');

//Initialize
const app = express();
const db = require('./database').iniciarConexion();
var server
if(config.production){
   let options = {
      key: fs.readFileSync(config.ssldir + 'privkey.pem'),
      cert: fs.readFileSync(config.ssldir + 'cert.pem'),
      ca: fs.readFileSync(config.ssldir + 'chain.pem')
  }
  server = require('https').createServer(options, app);
}else{
   server = require('http').createServer(app);
}

//Middlwares
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(cookieParser());
app.use(session({
   secret: process.env.SESSION_SECRET || config.sessionSecret,
   resave: false,
   saveUninitialized: false,
   store: MongoStore
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
require('./passport/google')();

const io = socketio(server)
io.use(passportSocketIo.authorize({
   store: MongoStore,
   secret: process.env.SESSION_SECRET || config.sessionSecret,
}));

require('./sockets').start(io, session);


//Routers
const defaultRouter = require('./routers/default');
const authRouter = require('./routers/auth');
const apiRouter = require('./routers/api');
app.use('/auth', authRouter);
app.use('/', defaultRouter);
app.use('/api', apiRouter);

//Listen
var port = process.env.PORT || config.defaultPort;
server.listen(port, () => {
   console.log('Server is running on port ' + port);
});