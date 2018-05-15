var express = require('express');
var router = express.Router();
var mysql_dbc = require('../db/db_con')();
var connection = mysql_dbc.init();
var path = require('path');
mysql_dbc.test_open(connection);

//회원가입
router.post('/addUser',function(req,res){
    var body = req.body;
    var user = {
        userID: body.userID,
        helper_pwd: body.helper_pwd,
        helper_name: body.helper_name,
        user_phone : body.user_phone,
        userType : 'helper',
        userFeedbackScore : body.userFeedbackScore,
        profile_image : body.profile_image,
        token : body.token,
        helpee_latitude:  body.helpee_latitude,
        helpee_longitude: body.helpee_longitude
    }
    var stmt = 'select *from user where userID = ?';
    connection.query(stmt,body.userID,function (err, result) {
        if(err) throw  err;
        else{
            if(result.length === 1) {
                res.send("duplication");
            }
            else{//아이디 중복이 아니면
                connection.query('INSERT INTO user SET ?',user,function (err,result) {
                    if(err) { throw err;}
                    res.send("success");
                })
            }
        }
    })
});

//자원봉사자 로그인
router.post('/login', function (req, res) {
    var stmt = 'select *from user where userID = ? AND helper_pwd = ?';
    var params = [req.body.userID,req.body.helper_pwd];
    connection.query(stmt,params,function (err, result) {
        if(err) throw  err;
        else{
            if(result.length === 0){
                res.send("fail");
            }
            else{
                res.send("success");
            }
        }
    })
});


//자원봉사리스트 가져오기
router.get('/getVolunteerList',function (req,res) {
    var stmt = 'select * from volunteerItem';
    connection.query(stmt,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
});

//Helper_ID 가 속해있는 자원봉사리스트 가져오기
router.get('/getVolunteerList/:helper_ID',function (req,res) {
    var stmt = 'select * from volunteerItem where helper_ID = ?';
    connection.query(stmt,req.params.helper_ID,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
});

//userID로 사용자 정보 검색
router.get('/getUserInfo/:userID',function (req,res) {
    var stmt = 'select * from user where userID = ?';
    var params = [req.params.userID];
    connection.query(stmt,params,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
});

//봉사 신청하기
router.put('/assignVolunteer',function (req,res){
    var stmt = 'UPDATE volunteerItem SET matchingStatus = ?,helper_ID=? WHERE volunteer_id = ?';
    var params = [1,req.body.helper_ID,req.body.volunteer_id];//1:매칭중
    connection.query(stmt,params,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
})

//봉사 신청하기 취소
router.put('/assignCancelVolunteer',function (req,res){
    var stmt = 'UPDATE volunteerItem SET matchingStatus = ?,helper_ID=? WHERE volunteer_id = ?';
    var params = [0,"",req.body.volunteer_id];//0:매칭 대기중
    connection.query(stmt,params,function(err,result){
        if(err) throw err;
        res.send('success');
    })
})

//userID로 사용자 정보 검색
router.get('/searchHelp',function (req,res) {
    var fromDate = req.query.fromDate;
    var toDate = req.query.toDate;
    var fromTime =req.query.fromTime;
    var toTime =req.query.toTime;
    var latitude = req.query.latitude;
    var longitude = req.query.longitude;
    var volunteerType = req.query.volunteerType;

    var distance;//

  /*  var firstQuery = 'UPDATE volunteerItem SET distance = ?, WHERE volunteer_id = ?';
    var params = [0,"",req.body.volunteer_id];//0:매칭 대기중
    connection.query(stmt,params,function(err,result){
        if(err) throw err;
        res.send('success');
    })
    */

    var secondQuery = 'select * from volunteeritem where  (date >= ? AND date <= ?) AND (time >= ? AND time <= ?) AND ';
    var params = [fromDate,toDate,fromTime,toTime];//1:매칭중
   //select * from volunteeritem where (date>='2018-05-01' AND date<'2018-05-16') AND (time>='11:00' AND time<'18:40');
  //  var stmt = 'select * from volunteeritem where  = ?';
    //connection.query(stmt,params,function(err,result){
     //   if(err) throw err;
     //   res.send(JSON.stringify(result));
    //})
    res.send(req.query);
});



module.exports = router;