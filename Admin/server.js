var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var express    = require('express');
var mysql      = require('mysql');

var index = require('./routes/index');
var helpee = require('./routes/helpee');
var helper = require('./routes/helper');
var admin = require('./routes/admin');
var apiDocument = require('./routes/document');
var contact = require('./routes/contact');
var join = require('./routes/join');
var contactApi = require('./routes/api/api-contact');
var app = express();
var server = require('http').createServer(app);
var port = process.env.PORT || 9001;


///////////////소영 추가 부분
var passport = require('passport') //passport module add
var LocalStrategy = require('passport-local').Strategy;
var cookieSession = require('cookie-session');
var flash = require('connect-flash');
app.use(cookieSession({
    keys: ['together'],
    cookie: {
        maxAge: 1000 * 60 * 60 // 유효기간 1시간
    }
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
//////////////////////////////////////////////////
server.listen(port,function(){
    console.log("Connect Server : " +port);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/helpee',helpee);
app.use('/helper',helper);
app.use('/admin',admin);
app.use('/contact-us' , contact);
app.use('/join-us' , join);
app.use('/photo',express.static(path.join(__dirname, 'uploads')));
var pathToSwaggerUi = require('swagger-ui-dist').absolutePath();
app.use('/swagger' , express.static(pathToSwaggerUi));
app.use('/document' , apiDocument);
app.use('/api/contacts' , contactApi);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
