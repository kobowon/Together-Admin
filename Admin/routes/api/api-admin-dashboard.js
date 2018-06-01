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
            volunteerItemRepository.countWeeklyStandby(function (standby) {
                result.standBy=standby;
                volunteerItemRepository.countWeeklyMatch(function (match) {
                    result.match=match;
                    volunteerItemRepository.countWeeklyMatched(function (matched) {
                        result.matched=matched;
                        volunteerItemRepository.selectListHelpeeScore(function (helpeeScore) {
                            result.helpeeScore = helpeeScore;
                            volunteerItemRepository.selectListHelperScore(function (helperScore) {
                                result.helperScore = helperScore;
                                response.send(JSON.stringify(result));
                            });
                        });
                    });
                });
            });
        });
    })
});

router.get('/weekly/volunteers', function (request, response) {
    var result = {};
    volunteerItemRepository.selectListStandbyWeekly(function (standBy) {
        result.standBy = standBy;
        
        volunteerItemRepository.selectListMatchWeekly(function (match) {
            result.match = match;

            volunteerItemRepository.selectListMatchedWeekly(function (matched) {
                result.matched = matched;

                response.send(JSON.stringify(result));
            })
        })
    });
});

router.get('/weekly/volunteers/:userId', function (request, response) {
    var result = {};

});

module.exports = router;
