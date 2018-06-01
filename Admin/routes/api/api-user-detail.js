var express = require('express');
var query = require('../../db/db_wrap')();
var router = express.Router();
var volunteerItemRepository = require('../../repository/volunteer/VolunteerItemRepository')();
var userRepository = require('../../repository/user/UserRepository')();

router.get('/user-detail/recent-vol/:userId', function(req,res) {
    /*userRepository.countHelpeeWeeklyStandby(function (weeklyStandby) {
        result.weeklyStandby = weeklyStandby;
        userRepository.countWeeklyMatch(function (weeklyMatch) {
            result.weeklyMatch = weeklyMatch;
            userRepository.countWeeklyMatched(function (weeklyMatched) {
                result.weeklyMatched = weeklyMatched;
            });
        });
    });*/
});