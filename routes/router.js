var express = require('express');
var router = express.Router();

var site = require('./site');

router.use(site);

module.exports = router;
