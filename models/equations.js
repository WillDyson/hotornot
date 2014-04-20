var mysql = require('mysql');

var connection = mysql.createConnection ({
    'host': 'localhost',
    'user': 'root',
    'database': 'HOTORNOT_TEST1'
});
connection.connect();

this.getFirst = function(callback) {
    connection.query("SELECT * FROM Equation LIMIT 1", function(err, rows, fields) {
        if(err) {
            callback(err, null);
            return;
        }

        if(rows == undefined || rows.length == 0) {
            callback(new Error("No rows selected from Equation!"), null);
            return;
        }

        callback(null, rows[0]);
    });
};

this.getFromId = function(id, callback) {
    var id = parseInt(id);

    connection.query("SELECT * FROM Equation WHERE id=? LIMIT 1", [id], function(err, rows, fields) {
        if(err) {
            callback(err, null);
            return;
        }

        if(rows == undefined || rows.length == 0) {
            callback(new Error("No rows selected from Equation!"), null);
            return;
        }

        callback(null, rows[0]);
    });
};

this.getPairFromId = function(id1, id2, callback) {
    var id1 = parseInt(id1);
    var id2 = parseInt(id2);

    connection.query("SELECT * FROM Equation WHERE id=? OR id=?", [id1, id2], function(err, rows, fields) {
        if(err) {
            callback(err, null, null);
            return;
        }

        if(rows == undefined || rows.length < 2) {
            callback(new Error("No rows selected from Equation!"), null, null);
            return;
        };

        if(rows[0].id == id1) callback(null, rows[0], rows[1]);
        else callback(null, rows[1], rows[0]);
    });
};

module.exports = this;
