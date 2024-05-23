'user strict';

var mysql = require('mysql');

//local mysql db connection
//Dev

var connection = mysql.createConnection({
    host: 'localhost',
    // port: 3306,
    user: 'root',
    password: 'password',
    database: 'retail',
    multipleStatements: true 
});


connection.connect(function (err) {
    if (err) throw err;
});

module.exports = connection;