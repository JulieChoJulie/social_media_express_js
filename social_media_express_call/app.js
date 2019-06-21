const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();

const indexRouter = require('./routes');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8003);


app.use(morgan('dev'));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: false,
        secure: false,
    },
}));

app.use('/', indexRouter);

app.use((error, req, res, next) => {
    res.locals.message = error.message;
    res.locals.error = req.app.get('env') === 'development' ? error : {};
    res.status(error.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log('Listening on port ', app.get('port'));
});