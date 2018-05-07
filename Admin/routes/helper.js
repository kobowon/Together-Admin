var express = require('express');
var router = express.Router();
var mysql_dbc = require('../db/db_con')();
var connection = mysql_dbc.init();
var path = require('path');
mysql_dbc.test_open(connection);

//자원봉사리스트 가져오기
router.get('/getVolunteerList',function (req,res) {
    var stmt = 'select * from volunteerItem';
    connection.query(stmt,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
});

//userID로 사용자 정보 검색
router.get('/getHelpeeInfo/:userID',function (req,res) {
    var stmt = 'select * from user where userID =?';
    connection.query(stmt,req.params.userID,function(err,result){
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
    var params = [0,req.body.helper_ID,req.body.volunteer_id];//0:매칭 대기중
    connection.query(stmt,params,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
})

//자원봉사요청
router.post('/addUser',function(req,res){
    var body = req.body;
    var user = {
        userID: body.userID,
        helper_pwd: body.helper_pwd,
        helper_name: body.helper_name,
        user_phone : body.user_phone,
        userType : body.userType,
        userFeedbackScore : body.userFeedbackScore,
        profile_image : body.profile_image,
        token : body.token,
        helpee_latitude:  body.helpee_latitude,
        helpee_longitude: body.helpee_longitude
    }
    connection.query('INSERT INTO user SET ?',user,function (err,result) {
        if(err) { throw err;}
        res.send("User is inserted");
    })
});




//자원봉사자 로그인
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