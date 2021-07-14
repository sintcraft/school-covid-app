require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const morgan = require('morgan');
const passport = require('./passport/passport');


//Middlwares
app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(cookieParser())
app.use(cookieSession({secret:"sint"}))
app.use(passport.initialize())


//Routers
const defaultRouter = require('./routers/default');
const protectedRouter = require('./routers/protected');
const apiRouter = require('./routers/api');
app.use('/', defaultRouter);
app.use('/', protectedRouter);
app.use('/api', apiRouter);

//Listen
app.listen(process.env.PORT || 80, () => {
   console.log('Server is running on port 80');
});