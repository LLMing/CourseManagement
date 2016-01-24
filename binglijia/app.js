var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var timeout = require("connect-timeout");

var app = express();
//在加载路由之前
app.use(timeout('10s'))    //如果3s还没有响应，req.timedout将返回true
app.use(function(req, res, next) {
    setTimeout(function() {
        if (req.timeout) {
            res.send(503);
        }
    }, 10 * 1000);

    next();    //继续执行
});
var routes = require('./routes/index');
var users = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//输出日志到目录
var fs = require('fs');
var accessLogStream = fs.createWriteStream(__dirname+'/log/access.log',{flags:'a',encoding:'utf8'});
app.use(logger('combined',{stream:accessLogStream}));

app.use('/', routes);
app.use('/VEANSserver', users);//自定义cgi路径

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
