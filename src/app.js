require('dotenv').config();
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const passport = require('passport');
const flash = require('connect-flash');

//Initialize
const app = express();
const db = require('./database').iniciarConexion();

//Middlwares
app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(session({
   secret: 'github_copilot',
   resave: false,
   saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
require('./passport/google')();


//Routers
const defaultRouter = require('./routers/default');
const authRouter = require('./routers/auth');
const apiRouter = require('./routers/api');
app.use('/', defaultRouter);
app.use('/auth', authRouter);
app.use('/api', apiRouter);

//Listen
app.listen(process.env.PORT || 80, () => {
   console.log('Server is running on port 80');
});