var express = require('express');
var router = express.Router();
var mysql_dbc = require('../db/db_con')();
var connection = mysql_dbc.init();
var path = require('path');
mysql_dbc.test_open(connection);


router.post('/requestVolunteer',function(req,res){
    var body = req.body;
    var VolunteerItem = {
        type: body.type,
        helpeeID: body.helpeeID,//auto increment
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
        day : body.day
    }
    connection.query('INSERT INTO volunteerItem SET ?',VolunteerItem,function (err,result) {
        if(err) { throw err;}
        res.send("Helpee request is inserted");
    })
})


module.exports = router;