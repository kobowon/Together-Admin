var express = require('express');
var router = express.Router();
var moment = require('moment');
var mysql_dbc = require('../../db/db_con')();
var connectionPool = mysql_dbc.createPool();

//최근 5개 feedback - 사진도 같이
router.get('/', function (request, response) {
    var queryStatement = 'select * from volunteeritem where helpeeFeedbackContent IS NOT NULL order by date desc limit 5';
    connectionPool.getConnection(function (err, connection) {
        // Use the connection
        connection.query(queryStatement,  function (err, result) {
            // And done with the connection.
            connection.release();
            if (err) throw err;
            else {
                console.log(result);
                response.send(JSON.stringify(result));
            }
        });
    });
});

router.get('/recent-feedback', function (request, response) {
    var queryStatement =
        'SELECT v.helpeeFeedbackContent, u.profileImage ' +
        'FROM volunteeritem AS v ' +
        'JOIN user AS u ON v.helpeeId = u.userId ' +
        'AND helpeeFeedbackContent IS NOT NULL order by date desc limit 5';
    connectionPool.getConnection(function (err, connection) {
        // Use the connection
        connection.query(queryStatement,  function (err, result) {
            // And done with the connection.
            connection.release();
            if (err) throw err;
            else {
                console.log(result);
                res.render('intro/index.ejs' , {feedbackList : result , moment : moment});
                response.send(JSON.stringify(result));
            }
        });
    });
});

module.exports = router;