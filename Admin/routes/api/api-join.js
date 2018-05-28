var express = require('express');
var router = express.Router();
var mysql_dbc = require('../../db/db_con')();
var connectionPool = mysql_dbc.createPool();


router.post('/', function (request, response) {
    var queryStatement = '' +
        'insert into request_join (name, phone, title, address , startAt , endAt , contents , latitude , longitude) ' +
        'values (? , ? , ? , ? , ? , ? , ? , ? , ?)';
    var requestBody = request.body;
    var params = [requestBody.name, requestBody.phone , requestBody.title , requestBody.address , requestBody.startAt , requestBody.endAt , requestBody.contents , requestBody.latitude , requestBody.longitude];

    connectionPool.getConnection(function (err, connection) {
        // Use the connection

        connection.query(queryStatement, params, function (err, result) {
            // And done with the connection.
            connection.release();
            if (err) throw err;
            response.end();
        });
    });


});

router.get('/', function (request, response) {
    var queryStatement = 'select * from request_join';
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
