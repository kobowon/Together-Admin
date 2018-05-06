var express = require('express');
var router = express.Router();
var mysql_dbc = require('../db/db_con')();
var connection = mysql_dbc.init();
var path = require('path');
mysql_dbc.test_open(connection);

//자원봉사리스트 가져오기
router.get('/getUserList/:initID',function (req,res) {
    console.log(req.params.initID);
    var stmt = 'select * from user where userId regexp \'^'+req.params.initID+'\'';
    connection.query(stmt,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
})

module.exports = router;

