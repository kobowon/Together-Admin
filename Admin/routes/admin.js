var express = require('express');
var router = express.Router();
var mysql_dbc = require('../db/db_con')();
var connection = mysql_dbc.init();
var path = require('path');
mysql_dbc.test_open(connection);

//모든 유저 가져오기
router.get('/getAllUserList',function (req,res) {
    var stmt = 'select * from user';
    connection.query(stmt,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
})

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


//volunteer_id 로 승인 대기 중/승인완료/승인거부 봉사리스트 가져오기
//소영 DB :alter table volunteeritem ADD acceptStatus boolean;
//[EXAMPLE]
//http://localhost:9001/admin/getVolunteerListByAcceptStatus/wait
//http://localhost:9001/admin/getVolunteerListByAcceptStatus/accept
//http://localhost:9001/admin/getVolunteerListByAcceptStatus/reject
router.get('/getVolunteerListByAcceptStatus/:acceptStatus',function (req,res) {
    var acceptStatus = req.params.acceptStatus;
    var partQuery;
    if(acceptStatus === 'wait') partQuery = 'is NULL';
    else if(acceptStatus === 'accept') partQuery = '= true';
    else if(acceptStatus === 'reject') partQuery = '= false';
    var stmt = 'select * from volunteerItem where acceptStatus '+partQuery;
    connection.query(stmt,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
});
//봉사 승인 {"volunteer_id" : 1}과 같이 데이터 보내면 됨
router.put('/acceptVolunteerItem',function (req,res) {
    var stmt = 'update volunteeritem set acceptStatus=true where volunteer_id=?';
    connection.query(stmt,req.body.volunteer_id,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })

})
//봉사 거부 {"volunteer_id" : 1}과 같이 데이터 보내면 됨
router.put('/rejectVolunteerItem',function (req,res) {
    var stmt = 'update volunteeritem set acceptStatus=false where volunteer_id=?';
    connection.query(stmt,req.body.volunteer_id,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })

})
module.exports = router;


