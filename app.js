var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();


var session = require('express-session');
var dbContext = require('./app/db-context');
var SequelizeStore = require('connect-session-sequelize')(session.Store);
var templateCache = require('./app/cache/template-cache');

var session = require('express-session');
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  store: new SequelizeStore({
    db: dbContext.Container
  })
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var routeDefine = require('./routes/routes');
routeDefine(app);
  
var expressHbs  = require('express-handlebars');
var hbsHelper = require('./app/ui-helper/format-helper');
hbsHelper(expressHbs);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', expressHbs({ extname:'hbs', defaultLayout:'_layout.hbs' }));
app.set('view engine', 'hbs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
  
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {    
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
     
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
