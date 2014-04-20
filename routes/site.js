var express = require('express');
var router = express.Router();

var equations = require('../models/equations');

router.get('/', function(req, res, next) {

    equations.getRandomPair(function(err, row1, row2) {
        if(err) {
            return next(err);
        } else {
            res.render('site/index', {
                title: 'Test Page',
                equ1: row1,
                equ2: row2
            });
        }
    });

});

router.get('/vote/:id1/beats/:id2', function(req, res, next) {

    var id1 = req.params.id1;
    var id2 = req.params.id2;

    equations.updateScores(id1, id2, 1);

    res.redirect('/');

});

module.exports = router;
