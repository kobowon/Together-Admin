var express = require('express');
var router = express.Router();
var mysql_dbc = require('../db/db_con')();
var connection = mysql_dbc.init();
var path = require('path');
mysql_dbc.test_open(connection);

router.post('/test',function (req,res) {
    var body = req.body;
    var data = {
        id: body.id,
        pwd: body.pwd
    }
    connection.query('INSERT INTO test SET ?',data,function (err,result) {
        if(err) { throw err;}
        res.send("testing ");
    })
})

//테스트용
router.post('/addUser',function(req,res){
    var body = req.body;
    var userItem = {
        userId: body.userId,
        userType: body.userType,
        feedbackScore: body.feedbackScore
    }
    connection.query('INSERT INTO usertable SET ?',userItem,function (err,result) {
        if(err) { throw err;}
        res.send("user is inserted");
    })
})

//자원봉사요청
router.post('/requestVolunteer',function(req,res){
    var body = req.body;
    var VolunteerItem = {
        type: body.type,
        helpee_ID: body.helpee_ID,
        helper_ID: body.helper_ID,
        longitude: body.longitude,
        latitude:  body.latitude,
        matchingStatus : body.matchingStatus,
        startStatus : body.startStatus,
        content : body.content,
        hour : body.hour,
        minute : body.minute,
        duration : body.duration,
        year : body.year,
        month : body.month,
        day : body.day,
        helpee_score:body.helpee_score,
        helper_score:body.helper_score
    }
    connection.query('INSERT INTO volunteerItem SET ?',VolunteerItem,function (err,result) {
        if(err) { throw err;}
        res.send("Helpee request is inserted");
    })
})


module.exports = router;