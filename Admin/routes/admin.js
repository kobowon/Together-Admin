var express = require('express');
var router = express.Router();
var mysql_dbc = require('../db/db_con')();
var connection = mysql_dbc.init();
var path = require('path');
mysql_dbc.test_open(connection);

//initID로 시작하는 UserList 가져오기
router.get('/getUserList/:initID',function (req,res) {
    console.log(req.params.initID);
    var stmt = 'select * from user where userID regexp \'^'+req.params.initID+'\'';
    connection.query(stmt,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
})

//userID 로 봉사리스트 가져오기
router.get('/getVolunteerListByUserID/:userID',function (req,res) {
    console.log(req.params.userID);
    var stmt = 'select * from volunteerItem where helper_ID = ? OR helpee_ID = ?';
    var params = [req.params.userID,req.params.userID];
    connection.query(stmt,params,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
});

//volunteer_id 로 봉사리스트 가져오기
router.get('/getVolunteerListByVolunteerID/:volunteer_id',function (req,res) {
    console.log(req.params.volunteer_id);
    var stmt = 'select * from volunteerItem where volunteer_id = ?';
    connection.query(stmt,req.params.volunteer_id,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
});

//userID로 유저에서 삭제
//{"userID": "tt"} 이런 형태로 post 처럼 보내면 됨
router.delete('/removeUser',function(req,res){
    var stmt = 'DELETE FROM user WHERE userID = ?';
    connection.query(stmt,req.body.userID,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
});
module.exports = router;


