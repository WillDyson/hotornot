
// routes example: https://github.com/visionmedia/express/tree/master/examples/route-separation

// import modules
var path = require('path');
var express = require('express');
var logger = require('morgan');
var favicon = require('static-favicon');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

// import routes
var router = require('./routes/router');

// initialize app
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// configuration
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.use(require('less-middleware')({
    dest: path.join(__dirname, 'public/css'),
    src: path.join(__dirname, 'private/less'),
    prefix: '/css'
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(router);

module.exports = app;
