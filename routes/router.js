var express = require('express')
var router = express.Router();

var site = require('./site');

/* GET site listing */
router.get('/', site.index);

module.exports = router;
