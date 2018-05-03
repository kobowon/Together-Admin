var express = require('express');
var router = express.Router();
var mysql_dbc = require('../db/db_con')();
var connection = mysql_dbc.init();
var path = require('path');
mysql_dbc.test_open(connection);

router.get('/getVolunteerList',function (req,res) {
    var stmt = 'select * from volunteerItem';
    connection.query(stmt,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
})

router.get('/login', function (req, res) {
    //var user_id = req.body.username;
    //var password = req.body.password;
    var user_id = 1;
    var stmt = 'select *from Persons where id = ?';
    connection.query(stmt,user_id,function (err, result) {
        if(err) throw  err;
        else{
            if(result.length === 0){
                res.send({success:false, msg:'해당 유저가 존재하지 않습니다.'})
            }
            else{
                res.send({success:true,msg:'존재하는 사용자 입니다.'})
            }
        }
    })
});


module.exports = router;