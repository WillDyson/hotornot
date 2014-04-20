var elo = require('../helpers/elo');
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

module.exports = this;
