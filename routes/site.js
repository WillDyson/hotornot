var express = require('express');
var router = express.Router();

var equations = require('../models/equations');

router.get('/', function(req, res) {
    res.render('site/index', { title: 'Test Page' });
});

router.get('/:id1,:id2', function(req, res) {

    var id1 = req.params.id1;
    var id2 = req.params.id2;

    if(isNaN(id1) || isNaN(id2)) throw "Given id is not a number!";

    equations.getPairFromId(id1, id2, function(err, row1, row2) {
        if(err) throw err;
        res.render('site/index', {
            title: 'Test Page',
            equ1: row1,
            equ2: row2
        });
    });

});

module.exports = router;
