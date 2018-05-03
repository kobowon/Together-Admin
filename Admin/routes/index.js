var express = require('express');
var router = express.Router();
var mysql_dbc = require('../db/db_con')();
var connection = mysql_dbc.init();
var path = require('path');
mysql_dbc.test_open(connection);
console.log('Hello world')

router.get('/helper/getVolunteerList',function (req,res) {
    var stmt = 'select * from volunteerItem';
    connection.query(stmt,function(err,result){
        if(err) throw err;
        res.send(JSON.stringify(result));
    })
})

router.post('/helpee/requestVolunteer',function(req,res){
    var body = req.body;
    var VolunteerItem = {
        type: body.type,
        helpeeID: body.helpeeID,
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
        console.log("[POST]/helpee/requestVolunteer");
        res.send("Helpee request is inserted");
    })
})

router.get('/join', function(req,res){
    res.sendFile(path.join(__dirname, '../public/join.html'))
})

router.post('/join', function(req,res){
    console.log('req.body is',req.body);
    var body = req.body;
    var email = body.email;
    var name = body.name;
    var passwd = body.password;

    var query = connection.query('insert into user (email, name, password) values ("' + email + '","' + name + '","' + passwd + '")', function(err, rows) {
        if(err) { throw err;}
        console.log("Data inserted!");
        res.send("Data inserted!");
    })
})

router.get('/test', function (req, res) {

  var stmt = 'select *from Persons';
    connection.query(stmt, function (err, result) {
       if(err) throw  err;

       var userId = result[0].id;
       var userName = result[0].name;
       var userAge = result[0].age;
       console.log('The solution is: ',result);
       console.log('userId is ',userId);
       console.log('userName is ',userName);
       console.log('userAge is ',userAge);

       res.render('index',{
         userId: userId,
         userName:userName,
         userAge:userAge
       });
    })
});

//helper login
router.get('/helper/login', function (req, res) {
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

router.get('/index', function(req, res, next) {
    res.render('index.html')
});


module.exports = router;
