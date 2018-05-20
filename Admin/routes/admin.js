var express = require('express');
var router = express.Router();
var mysql_dbc = require('../db/db_con')();
var connection = mysql_dbc.init();
var path = require('path');
mysql_dbc.test_open(connection);

//모든 유저 가져오기
/*router.get('/get-all-userlist',function (req,res) {
    var stmt = 'select * from user';
    connection.query(stmt,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
});*/
//모든 유저 가져오기
router.get('/users',function (req,res) {
    var stmt = 'select * from user';
    connection.query(stmt,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
});

//모든 봉사리스트 가져오기
/*router.get('/get-all-volunteerlist',function (req,res) {
    var stmt = 'select * from volunteeritem';
    connection.query(stmt,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
})*/

//모든 봉사리스트 가져오기
router.get('/volunteers',function (req,res) {
    var stmt = 'select * from volunteeritem';
    connection.query(stmt,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
})


//initID로 시작하는 UserList 가져오기
/*router.get('/get-userlist/:initID',function (req,res) {
    console.log(req.params.initID);
    var stmt = 'select * from user where userId regexp \'^'+req.params.initID+'\'';
    connection.query(stmt,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
})*/

//initID로 시작하는 UserList 가져오기
router.get('/users/init-id/:initId',function (req,res) {
    console.log(req.params.initId);
    var stmt = 'select * from user where userId regexp \'^'+req.params.initId+'\'';
    connection.query(stmt,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
})

//userId 로 봉사리스트 가져오기
/*router.get('/get-volunteerlist-by-userid/:userId',function (req,res) {
    console.log(req.params.userId);
    var stmt = 'select * from volunteerItem where helper_ID = ? OR helpee_ID = ?';
    var params = [req.params.userId,req.params.userId];
    connection.query(stmt,params,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
});*/

//userId 로 봉사리스트 가져오기
router.get('/volunteers/user-id/:userId',function (req,res) {
    console.log(req.params.userId);
    var stmt = 'select * from volunteerItem where helperId = ? OR helpeeId = ?';
    var params = [req.params.userId,req.params.userId];
    connection.query(stmt,params,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
});

//volunteer_id 로 봉사리스트 가져오기
/*router.get('/get-volunteerlist-by-volunteerid/:volunteer_id',function (req,res) {
    console.log(req.params.volunteer_id);
    var stmt = 'select * from volunteerItem where volunteer_id = ?';
    connection.query(stmt,req.params.volunteer_id,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
});*/

//volunteer_id 로 봉사리스트 가져오기
router.get('/volunteers/volunteer-id/:volunteerId',function (req,res) {
    console.log(req.params.volunteerId);
    var stmt = 'select * from volunteerItem where volunteerId = ?';
    connection.query(stmt,req.params.volunteerId,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
});

//userID로 유저에서 삭제
//{"userId": "tt"} 이런 형태로 post 처럼 보내면 됨
/*router.delete('/remove-user',function(req,res){
    var stmt = 'DELETE FROM user WHERE userId = ?';
    connection.query(stmt,req.body.userId,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
});*/

//userID로 유저에서 삭제
//{"userId": "tt"} 이런 형태로 post 처럼 보내면 됨
router.delete('/user',function(req,res){
    var stmt = 'DELETE FROM user WHERE userId = ?';
    connection.query(stmt,req.body.userId,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
});

//volunteer_id 로 승인 대기 중/승인완료/승인거부 봉사리스트 가져오기
/*router.get('/get-volunteerlist-by-acceptstatus/:acceptStatus',function (req,res) {
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
});*/
//volunteer_id 로 승인 대기 중/승인완료/승인거부 봉사리스트 가져오기
//acceptStatus = 'wait' 'accept' 'reject'로 줄 것 varchar(20)
router.get('/volunteers/accept-status/:acceptStatus',function (req,res) {
    var acceptStatus = req.params.acceptStatus;
    var stmt = 'select * from volunteerItem where acceptStatus = ?';
    connection.query(stmt,acceptStatus,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
});

//봉사 승인 {"volunteer_id" : 1}과 같이 데이터 보내면 됨
/*router.put('/accept-volunteeritem',function (req,res) {
    var stmt = 'update volunteeritem set acceptStatus=true where volunteer_id=?';
    connection.query(stmt,req.body.volunteer_id,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
})*/
//봉사 승인 {"volunteer_id" : 1}과 같이 데이터 보내면 됨
router.put('/volunteer/accept',function (req,res) {
    var stmt = 'update volunteeritem set acceptStatus=? where volunteerId=?';
    var params = ['accept',req.body.volunteerId];
    connection.query(stmt,params,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
})
//봉사 거부 {"volunteer_id" : 1}과 같이 데이터 보내면 됨
/*router.put('/reject-volunteeritem',function (req,res) {
    var stmt = 'update volunteeritem set acceptStatus=false where volunteer_id=?';
    connection.query(stmt,req.body.volunteer_id,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
})*/
//봉사 거부 {"volunteer_id" : 1}과 같이 데이터 보내면 됨
router.put('/volunteer/reject',function (req,res) {
    var stmt = 'update volunteeritem set acceptStatus=? where volunteerId=?';
    var params = ['reject',req.body.volunteerId];
    connection.query(stmt,params,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
})
//봉사 승인 대기상태로 돌리기 {"volunteer_id" : 1}과 같이 데이터 보내면 됨
router.put('/volunteer/wait',function (req,res) {
    var stmt = 'update volunteeritem set acceptStatus=? where volunteerId=?';
    var params = ['wait',req.body.volunteerId];
    connection.query(stmt,params,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
})

module.exports = router;


