var express = require('express');
var router = express.Router();
var mysql_dbc = require('../db/db_con')();
var connectionPool = mysql_dbc.createPool();

router.get('/' , function (req , res) {
    res.render('contact-us/index.html');
})

router.get('/info', function (req, res) {
    var stmt = 'select * from contact';
    connectionPool.getConnection(function (err, connection) {
        connection.query(stmt,function (err, result) {
            connection.release();
            if (err) throw err;
            res.send(JSON.stringify(result));
        });
    });
});

module.exports = router;
