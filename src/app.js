require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const socketio = require('socket.io');
const passportSocketIo = require('passport.socketio');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo').create({ mongoUrl: process.env.mongoURI });

//Initialize
const app = express();
const db = require('./database').iniciarConexion();
const server = require('http').createServer(app);

//Middlwares
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(cookieParser());
app.use(session({
   secret: process.env.SESSION_SECRET,
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
   secret: process.env.SESSION_SECRET,
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
server.listen(process.env.PORT || 80, () => {
   console.log('Server is running on port 80');
});