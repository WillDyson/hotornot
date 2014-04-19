var mysql = require('mysql');

var connection = mysql.createConnection ({
    'host': 'localhost',
    'user': 'root',
    'database': 'HOTORNOT_TEST1'
});
connection.connect();

this.getFirst = function(callback) {
    connection.query("SELECT * FROM Equation LIMIT 1", function(err, rows, fields) {
        if(err) callback(err, null);
        callback(err, rows[0]);
    });
}

module.exports = this;
