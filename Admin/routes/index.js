var express = require('express');
var router = express.Router();
var mysql_dbc = require('../db/db_con')();
var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);
console.log('Hello world')

router.get('/mysql/test', function (req, res) {

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


/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Hello World');
});

router.get('/index', function(req, res, next) {
    res.render('index.html')
});

module.exports = router;
