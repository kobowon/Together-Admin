var express = require('express');
var router = express.Router();
var mysql_dbc = require('../../db/db_con')();
var connectionPool = mysql_dbc.createPool();

router.get('/', function (request, response) {
    //select * from volunteeritem where helpeeFeedbackContent IS NOT NULL order by date desc limit 5;
    var queryStatement = 'select * from volunteeritem where helpeeFeedbackContent IS NOT NULL order by date desc limit 5';
    connectionPool.getConnection(function (err, connection) {
        // Use the connection
        connection.query(queryStatement,  function (err, result) {
            // And done with the connection.
            connection.release();
            if (err) throw err;
            else {
                response.send(JSON.stringify(result));
            }
        });
    });
});

module.exports = router;