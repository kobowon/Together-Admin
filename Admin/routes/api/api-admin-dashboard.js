var express = require('express');
var router = express.Router();
var mysql_dbc = require('../../db/db_con')();
var connectionPool = mysql_dbc.createPool();


function queryWrapper(query , callback) {
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
}

router.get('/weekly-user', function(request,response){


    var newUserWeeklyCountQuery = 'SELECT DATE_FORMAT(createdAt , "%d") as date ,  count(userId) as newUser FROM user where TO_DAYS(NOW()) - TO_DAYS(createdAt) <= 7 group by createdAt';
    queryWrapper(newUserWeeklyCountQuery , function (row) {
        response.send(JSON.stringify(row));
    });
})

module.exports = router;
