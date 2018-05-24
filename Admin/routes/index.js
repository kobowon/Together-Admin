var express = require('express');
var router = express.Router();
var mysql_dbc = require('../db/db_con')();
/*var connection = mysql_dbc.init();*/
var path = require('path');
var connectionPool = mysql_dbc.createPool();
/*mysql_dbc.test_open(connectionPool);*/



router.get('/join', function(req,res){
    res.sendFile(path.join(__dirname, '../public/join.html'))
})

router.post('/join', function(req,res){
    console.log('req.body is',req.body);
    var body = req.body;
    var email = body.email;
    var name = body.name;
    var passwd = body.password;
    connectionPool.getConnection(function(err, connection) {
        // Use the connection
        connection.query( 'insert into user (email, name, password) values ("' + email + '","' + name + '","' + passwd + '")', function(err, result) {
            // And done with the connection.
            connection.release();
            if(err) throw err;
            console.log("Data inserted!");
            res.send("Data inserted!");
        });
    });
/*    var query = connection.query('insert into user (email, name, password) values ("' + email + '","' + name + '","' + passwd + '")', function(err, rows) {
        if(err) { throw err;}
        console.log("Data inserted!");
        res.send("Data inserted!");
    })*/
});

router.get('/test', function (req, res) {
  var stmt = 'select *from Persons';
    connectionPool.getConnection(function(err, connection) {
        // Use the connection
        connection.query( stmt, function(err, result) {
            // And done with the connection.
            connection.release();
            if(err) throw err;
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
        });
    });
/*    connection.query(stmt, function (err, result) {
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
    })*/
});

router.get('/usermanage', function(req,res){
    res.render('usermanage.html');
})

router.get('/approve', function(req,res){
    res.render('approve.html');
})

router.get('/bowon', function(req,res){
    res.render('bowon.html');
})

router.post('/', function(req,res){
    var body = req.body;
    var email = body.email;
    var name = body.name;
    var passwd = body.password;

    connectionPool.getConnection(function(err, connection) {
        // Use the connection
        connection.query('insert into user (email, name, password) values ("' + email + '","' + name + '","' + passwd + '")', function(err, result) {
            // And done with the connection.
            connection.release();
            if(err) throw err;
            console.log("Data inserted!");
        });
    });
/*    var query = connection.query('insert into user (email, name, password) values ("' + email + '","' + name + '","' + passwd + '")', function(err, rows) {
        if(err) { throw err;}
        console.log("Data inserted!");
    })*/
})


module.exports = router;

//id(Auto Increment), 토큰(string), 사진(blob)을 동시에 하나의 테이블 -> 장애인 회원정보 db
//날짜,시간,봉사종류,경도,위도 ->string -> 봉사정보
