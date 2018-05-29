var express = require('express');
var query = require('../../db/db_wrap')();
var router = express.Router();
var accessRepository = require('../../repository/access/AccessRepository')();

router.get('/weekly-user', function (request, response) {
    var result = {};
    var newUserWeeklyCountQuery = '\n' +
        'select DATE_FORMAT(createdAt , \'%m-%d\') as date ,    count(userId) as newUser from (\n' +
        '  SELECT *  FROM user where TO_DAYS(NOW()) - TO_DAYS(createdAt) <= 7\n' +
        ') as weekly  group by date;';
    query.execute(newUserWeeklyCountQuery, function (users) {

        result.users = users;
        accessRepository.selectListByWeekly(function (accesses) {
            result.accesses = accesses;
            response.send(JSON.stringify(result));
        });
    });
});

router.get('/weekly-access', function (request, response) {


});


module.exports = router;
