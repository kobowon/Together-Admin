var mysql_dbc = require('../db/db_con')();
var connectionPool = mysql_dbc.createPool();

module.exports = function () {
    return {
        execute: function (query,  callback) {

            connectionPool.getConnection(function (err, connection) {

                connection.query(query, function (err, result) {
                    // And done with the connection.
                    connection.release();

                    if (err) throw err;

                    if (callback != null) {
                        callback(result);
                    }
                });
            });
        },
        executeWithData: function (query, data ,   callback) {

            connectionPool.getConnection(function (err, connection) {

                connection.query(query, data , function (err, result) {
                    // And done with the connection.
                    connection.release();

                    if (err) throw err;

                    if (callback != null) {
                        callback(result);
                    }
                });
            });
        }
    }
};

