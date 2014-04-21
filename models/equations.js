var elo = require('../helpers/elo');
var crypto = require('crypto');
var mysql = require('mysql');

var connection = mysql.createConnection ({
    'host': 'localhost',
    'user': 'root',
    'database': 'HOTORNOT_TEST1'
});
connection.connect();

this.getFromId = function(id, callback) {
    var id = parseInt(id);

    connection.query("SELECT * FROM Equation WHERE id=? LIMIT 1", [id], function(err, rows, fields) {
        if(err) return callback(err, null);
        if(rows == undefined || rows.length == 0) return callback(new Error("No rows selected from Equation!"), null);

        callback(null, rows[0]);
    });
};

this.getPairFromId = function(id1, id2, callback) {
    var id1 = parseInt(id1);
    var id2 = parseInt(id2);

    connection.query("SELECT * FROM Equation WHERE id=? OR id=?", [id1, id2], function(err, rows, fields) {
        if(err) return callback(err, null, null);
        if(rows == undefined || rows.length < 2) return callback(new Error("No rows selected from Equation!"), null, null);

        if(rows[0].id == id1) callback(null, rows[0], rows[1]);
        else callback(null, rows[1], rows[0]);
    });
};

this.getRandomPair = function(callback) {
    connection.query("SELECT * FROM Equation ORDER BY RAND() LIMIT 2", function(err, rows, fields) {
        if(err) return callback(err, null, null);
        if(rows == undefined || rows.length < 2) return callback(new Error("No rows selected from Equation!"), null, null);

        callback(null, rows[0], rows[1]);
    });
};

this.getRandomPairWithToken = function(callback) {
    this.getRandomPair(function(err, row1, row2) {
        if(err) return callback(err, null, null, null);

        this.generateToken(row1.id, row2.id, function(err, token) {
            if(err) return callback(err, null, null, null);

            callback(null, row1, row2, token);
        });
    }.bind(this));
}

this.updateScores = function(id1, id2, winner) {
    if(winner != 1 && winner != 2) return;

    var id1 = parseInt(id1);
    var id2 = parseInt(id2);


    this.getPairFromId(id1, id2, function(err, row1, row2) {

            if(err) return;
            if(row1.score <= 0 || row2.score <= 0) return;

            elo.calculateScores(row1.score, row2.score, winner, function(newP1, newP2) {
                if(newP1 <= 0 || newP2 <= 0) return;

                connection.query("UPDATE Equation SET score=? WHERE id=?", [newP1, id1]);
                connection.query("UPDATE Equation SET score=? WHERE id=?", [newP2, id2]);
            });

    });
};

this.generateToken = function(id1, id2, callback) {

    var token = crypto.randomBytes(10).toString('hex').substring(0,20);
    var id1 = parseInt(id1);
    var id2 = parseInt(id2);

    connection.query("INSERT INTO VoteToken (token, id1, id2, expire) VALUES (?, ?, ?, CURRENT_TIMESTAMP + INTERVAL 10 MINUTE)", [token, id1, id2])
        .on('error', function(err) {
                return callback(new Error("Failed to generate vote token"), null);
        })
        .on('result', function(results) {
                return callback(null, token);
        });

};

this.verifyToken = function(token, id1, id2, callback) {

    var id1 = parseInt(id1);
    var id2 = parseInt(id2);

    connection.query("SELECT id, id1, id2 FROM VoteToken WHERE deleted=0 AND token=? AND expire > CURRENT_TIMESTAMP", [token], function(err, rows, fields) {
        if(err || rows == undefined || rows.length == 0) return callback(new Error("Failed to verify vote token"));

        if((rows[0].id1 == id1 && rows[0].id2 == id2) || (rows[0].id1 == id2 && rows[0].id2 == id1)) callback(null);
        else callback(new Error("Failed to verify vote token"));

        connection.query("UPDATE VoteToken SET deleted=1 WHERE id=?", [rows[0].id]);
    });

};

this.top10 = function(callback) {
    connection.query("SELECT * FROM Equation ORDER BY score DESC LIMIT 10", function(err, rows, fields) {
        if(err || rows == undefined || rows.length == 0) return callback(new Error("Failed to verify vote token"), null);

        callback(null, rows);
    });
};

module.exports = this;
