var express = require('express');
var query = require('../../db/db_wrap')();
var router = express.Router();
var accessRepository = require('../../repository/access/AccessRepository')();
var volunteerItemRepository = require('../../repository/volunteer/VolunteerItemRepository')();
var userRepository = require('../../repository/user/UserRepository')();

router.get('/weekly-user', function (request, response) {
    var result = {};

    userRepository.selectListByWeekly(function (users) {
        result.users = users;
        accessRepository.selectListByWeekly(function (accesses) {
            result.accesses = accesses;

            volunteerItemRepository.selectListHelpeeScore(function (helpeeScore) {
               result.helpeeScore = helpeeScore;
               
               volunteerItemRepository.selectListHelperScore(function (helperScore) {
                   result.helperScore = helperScore;
                   response.send(JSON.stringify(result));
               })
            });
        });
    })
});


module.exports = router;
