var express = require('express');
var query = require('../../db/db_wrap')();

var router = express.Router();


router.get('/weekly-user', function(request,response){

    var newUserWeeklyCountQuery = 'SELECT DATE_FORMAT(createdAt , "%d") as date ,  count(userId) as newUser FROM user where TO_DAYS(NOW()) - TO_DAYS(createdAt) <= 7 group by createdAt';
    query.execute(newUserWeeklyCountQuery , function (row) {
        response.send(JSON.stringify(row));
    });
})

module.exports = router;
