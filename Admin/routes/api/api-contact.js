var express = require('express');
var router = express.Router();
var mysql_dbc = require('../../db/db_con')();
var connectionPool = mysql_dbc.createPool();


router.post('/', function (request, response) {
    var queryStatement = 'insert into contact (name, email, title, messages) values (? , ? , ? , ?)';
    var requestBody = request.body;
    var params = [requestBody.name, requestBody.email , requestBody.title , requestBody.message];

    connectionPool.getConnection(function (err, connection) {
        // Use the connection
        connection.query(queryStatement, params, function (err, result) {
            // And done with the connection.
            connection.release();
            if (err) throw err;
            response.end();
        });

        if (err) throw err;
    });
});

router.get('/', function (request, response) {
    var queryStatement = 'select * from contact';
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
