var express = require('express');
var router = express.Router();

var equations = require('../models/equations');

router.get('/', function(req, res) {
    res.render('site/index', { title: 'Test Page' });
});

router.get('/:id1,:id2', function(req, res) {
    var id1 = req.params.id1;
    var id2 = req.params.id2;

    equations.getFirst(function(err, result) {
        res.send(result.name);
    });
});

module.exports = router;
