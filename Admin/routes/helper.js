var express = require('express');
var router = express.Router();
var mysql_dbc = require('../db/db_con')();
var connection = mysql_dbc.init();
var path = require('path');
mysql_dbc.test_open(connection);

//회원가입
/*router.post('/add-user',function(req,res){
    var body = req.body;
    var user = {
        userId: body.userId,
        helperPwd: body.helperPwd,
        helperName: body.helperName,
        userPhone : body.userPhone,
        userType : 'helper',
        userFeedbackScore : body.userFeedbackScore,
        profileImage : body.profileImage,
        token : body.token,
        helpeeLatitude:  body.helpeeLatitude,
        helpeeLongitude: body.helpeeLongitude
    }
    var stmt = 'select *from user where userId = ?';
    connection.query(stmt,body.userId,function (err, result) {
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
});*/
//회원가입
router.post('/signup',function(req,res){
    var body = req.body;
    var user = {
        userId: body.userId,
        helperPwd: body.helperPwd,
        helperName: body.helperName,
        userPhone : body.userPhone,
        userType : 'helper',
        userFeedbackScore : body.userFeedbackScore,
        profileImage : body.profileImage,
        token : body.token,
        helpeeLatitude:  body.helpeeLatitude,
        helpeeLongitude: body.helpeeLongitude
    }
    var stmt = 'select *from user where userId = ?';
    connection.query(stmt,body.userId,function (err, result) {
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
    var stmt = 'select *from user where userId = ? AND helperPwd = ?';
    var params = [req.body.userId,req.body.helperPwd];
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
/*router.get('/get-volunteerlist',function (req,res) {
    var stmt = 'select * from volunteerItem';
    connection.query(stmt,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
});*/
//자원봉사리스트 가져오기
router.get('/volunteers',function (req,res) {
    var stmt = 'select * from volunteeritem';
    connection.query(stmt,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
});

//Helper_ID 가 속해있는 자원봉사리스트 가져오기
/*router.get('/get-volunteerlist/:helper_ID',function (req,res) {
    var stmt = 'select * from volunteerItem where helper_ID = ?';
    connection.query(stmt,req.params.helper_ID,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
});*/
//Helper_ID 가 속해있는 자원봉사리스트 가져오기
router.get('/volunteers/:helperId',function (req,res) {
    var stmt = 'select * from volunteeritem where helperId = ?';
    connection.query(stmt,req.params.helperId,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
});

//userID로 사용자 정보 검색
/*router.get('/get-userinfo/:userId',function (req,res) {
    var stmt = 'select * from user where userId = ?';
    var params = [req.params.userId];
    connection.query(stmt,params,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
});*/
//userID로 사용자 정보 검색
router.get('/user/:userId',function (req,res) {
    var stmt = 'select * from user where userId = ?';
    var params = [req.params.userId];
    connection.query(stmt,params,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
});

//봉사 신청하기
/*router.put('/assign-volunteer',function (req,res){
    var stmt = 'UPDATE volunteerItem SET matchingStatus = ?,helper_ID=? WHERE volunteer_id = ?';
    var params = [1,req.body.helper_ID,req.body.volunteer_id];//1:매칭중
    connection.query(stmt,params,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
})*/
//봉사 신청하기
router.put('/volunteer/assign',function (req,res){
    var stmt = 'UPDATE volunteeritem SET matchingStatus = ?,helperId=? WHERE volunteerId = ?';
    var params = [1,req.body.helperId,req.body.volunteerId];//1:매칭중
    connection.query(stmt,params,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
})


//봉사 신청하기 취소
/*router.put('/assign-cancel-volunteer',function (req,res){
    var stmt = 'UPDATE volunteerItem SET matchingStatus = ?,helper_ID=? WHERE volunteer_id = ?';
    var params = [0,"",req.body.volunteer_id];//0:매칭 대기중
    connection.query(stmt,params,function(err,result){
        if(err) throw err;
        res.send('success');
    })
})*/
//봉사 신청하기 취소
router.put('/volunteer/assign/cancel',function (req,res){
    var stmt = 'UPDATE volunteeritem SET matchingStatus = ?,helperId=? WHERE volunteerId = ?';
    var params = [0,"",req.body.volunteerId];//0:매칭 대기중
    connection.query(stmt,params,function(err,result){
        if(err) throw err;
        res.send('success');
    })
})
//맞춤 검색
/*router.get('/search-volunteer',function (req,res) {
    var fromDate = req.query.fromDate;
    //var fromDate = '2018-01-01';
    var toDate = req.query.toDate;
    //var toDate = '2018-06-06';
    var fromTime =req.query.fromTime;
    //var fromTime  = '09:00';
    var toTime =req.query.toTime;
    //var toTime = '20:00';
    var latitude = req.query.latitude;
    var longitude = req.query.longitude;
    //var latitude = 37.276900;
    //var longitude = 127.038535;
    var volunteerType = req.query.volunteerType;
    //var volunteerType = 'lyrics';
    var stmt = 'select * from volunteeritem' +
        ' where (matchingStatus = 0 AND SQRT(POW(latitude-?,2)+POW(longitude-?,2))<0.04)' +
        ' AND (date >= ? AND date <= ?) ' +
        ' AND (time >= ? AND time <= ?) AND (type=?)';
    console.log('query is' + stmt);
    var params = [latitude,longitude,fromDate,toDate,fromTime,toTime,volunteerType];
    connection.query(stmt,params,function (err,result) {
        if(err) throw  err;
        console.log(result);
        res.send(JSON.stringify(result));
    })
});*/
//맞춤 검색
router.get('/volunteer/search',function (req,res) {
    console.log('쿼리문 : ',req.query);
    console.log('fromDate',req.query.fromDate);
    console.log('fromTime',req.query.fromTime);

    var fromDate = req.query.fromDate;
    //var fromDate = '2018-01-01';
    var toDate = req.query.toDate;
    //var toDate = '2018-06-06';
    var fromTime =req.query.fromTime;
    //var fromTime  = '09:00';
    var toTime =req.query.toTime;
    //var toTime = '20:00';
    var latitude = req.query.latitude;
    var longitude = req.query.longitude;
    //var latitude = 37.276900;
    //var longitude = 127.038535;
    var volunteerType = req.query.volunteerType;
    //var volunteerType = 'lyrics';
    var stmt = 'select * from volunteeritem' +
        ' where (matchingStatus = 0 AND SQRT(POW(latitude-?,2)+POW(longitude-?,2))<0.04)' +
        ' AND (date >= ? AND date <= ?) ' +
        ' AND (time >= ? AND time <= ?) AND (type=?)';
    console.log('query is' + stmt);
    var params = [latitude,longitude,fromDate,toDate,fromTime,toTime,volunteerType];
    connection.query(stmt,params,function (err,result) {
        if(err) throw  err;
        console.log(result);
        res.send(JSON.stringify(result));
    })
});


module.exports = router;