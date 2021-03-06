var express = require('express');
var router = express.Router();

var equations = require('../models/equations');

router.get('/', function(req, res, next) {

    equations.getRandomPairWithToken(function(err, row1, row2, tok) {
        if(err) {
            err.status = 500;
            return next(err);
        } else {
            res.render('site/index', {
                title: 'HotOrNot',
                equ1: row1,
                equ2: row2,
                token: tok
            });
        }
    });

});

router.get('/leaderboard', function(req, res, next) {

        equations.top10(function(err, leaders) {
            if(err) {
                err.status = 500;
                return next(err);
            }

            res.render('site/leaderboard', {
                title: 'Leaderboard',
                leaders: leaders
            });
        });

});

router.get('/vote/:id1/:id2/:token', function(req, res, next) {

    var id1 = req.params.id1;
    var id2 = req.params.id2;
    var token = req.params.token;

    equations.verifyToken(token, id1, id2, function(err) {
        if(err) {
            err.status = 500;
            return next(err);
        }

        equations.updateScores(id1, id2, 1);
        res.redirect('/');
    });

});

module.exports = router;
