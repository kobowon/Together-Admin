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

router.post('/', function (request, response) {
    //name -> user.userId
    //phone -> user.userPhone
    //title -> volunteeritem.content
    //address -> volunteeritem.content
    //startAt -> volunteeritem.time
    //endAt ->  duration
    //var time = (endAt - startAt) / (60 * 60 * 1000);
    //var duration = Math.ceil(time);
    //contents -> volunteeritem.content
    //latitude -> user.latitude
    //longitude -> user.longitude

    var queryStatement = '' +
        'insert into request_join (name, phone, title, address , startAt , endAt , contents , latitude , longitude) ' +
        'values (? , ? , ? , ? , ? , ? , ? , ? , ?)';
    var requestBody = request.body;
    var params = [requestBody.name, requestBody.phone, requestBody.title, requestBody.address, requestBody.startAt, requestBody.endAt, requestBody.contents, requestBody.latitude, requestBody.longitude];

    connectionPool.getConnection(function (err, connection) {
        // Use the connection

        connection.beginTransaction(function (err) {
            if (err) {
                throw err;
            }
            connection.query(queryStatement, params, function (err, result) {
                // And done with the connection.
                if (err) {
                    console.error(err);
                    connection.rollback(function () {
                        console.error('rollback error');
                        throw err;
                    });
                }//if err
                console.log('insert transaction log');

                queryStatement = 'insert into user (userId,name,userPhone,userType,latitude,longitude) values(?,?,?,?,?)'
                pararms = [requestBody.phone, requestBody.name, requestBody.phone, 'institute', requestBody.latitude, requestBody.longitude];
                connection.query(queryStatement, params, function (err, result) {
                    if (err) {
                        console.error(err);
                        connection.rollback(function () {
                            console.error('rollback error');
                            throw err;
                        });
                    }//if err
                    //name -> user.userId
                    //title -> volunteeritem.content
                    //address -> volunteeritem.content
                    //startAt -> volunteeritem.time
                    //endAt ->  duration
                    //var time = (endAt - startAt) / (60 * 60 * 1000);
                    //var duration = Math.ceil(time);
                    //contents -> volunteeritem.content
                    queryStatement = 'insert into volunteeritem (helpeeId,userPhone,userType,latitude,longitude) values(?,?,?,?,?)'
                    pararms = [requestBody.name, requestBody.phone, 'institute', requestBody.latitude, requestBody.longitude];
                    connection.query(queryStatement, params, function (err, result) {
                        if (err) {
                            console.error(err);
                            connection.rollback(function () {
                                console.error('rollback error');
                                throw err;
                            });
                        }//if err

                    });

                    connection.release();
                    response.end();
                });
            })
        });
    });
});

module.exports = router;
