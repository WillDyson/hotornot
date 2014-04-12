
// routes example: https://github.com/visionmedia/express/tree/master/examples/route-separation

// import modules
var path = require('path');
var express = require('express');
var logger = require('morgan');

// import routes
var site = require('./routes/site');

// initialize app
var app = express();

// configuration
app.use(logger('dev'));
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// set routes
app.get('/', site.index);

module.exports = app

