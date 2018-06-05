var express = require('express');
var query = require('../../db/db_wrap')();
var moment = require('moment');
var router = express.Router();
var accessRepository = require('../../repository/access/AccessRepository')();
var volunteerItemRepository = require('../../repository/volunteer/VolunteerItemRepository')();
var userRepository = require('../../repository/user/UserRepository')();

router.get('/volunteer/log/:volunteerId', function (req, res) {
    var result = {};
    var helpeeLogQuery = 'select helpeeLongitude as lng,helpeeLatitude as lat,date from location where volunteerId = ? AND helpeeLongitude is NOT NULL';
    var helperLogQuery = 'select helperLongitude as lng,helperLatitude as lat,date from location where volunteerId = ? AND helperLongitude is NOT NULL';
    query.executeWithData(helpeeLogQuery,req.params.volunteerId,function (helpeeLog) {
        result.helpeeLog=helpeeLog;
        query.executeWithData(helperLogQuery,req.params.volunteerId,function (helperLog) {
            result.helperLog=helperLog;
            res.send(JSON.stringify(result));
        });
    });
});

router.get('/volunteer/old',function (request,response) {
    var result = {};
    volunteerItemRepository.selectOldVolunteers(function (volunteer) {
        result.volunteer = volunteer;
        response.send(JSON.stringify(result));
    })
});

router.get('/volunteer/recent/accept',function (request,response) {
    var result = {};
    volunteerItemRepository.selectRecentAcceptVolunteers(function (volunteer) {
        result.volunteer = volunteer;
        response.send(JSON.stringify(result));
    })
});

router.get('/user/recent/signup',function (request,response) {
    var result = {};
    userRepository.selectRencentUser(function (user) {
        result.user = user;
        response.send(JSON.stringify(result));
    })
});

router.get('/user/low-score',function (request,response) {
    var result = {};
    userRepository.selectLowScoreUser(function (user) {
        result.user = user;
        response.send(JSON.stringify(result));
    })
});

module.exports = router;