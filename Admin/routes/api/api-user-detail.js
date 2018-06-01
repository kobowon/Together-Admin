var express = require('express');
var query = require('../../db/db_wrap')();
var router = express.Router();
var moment = require('moment');
var accessRepository = require('../../repository/access/AccessRepository')();
var volunteerItemRepository = require('../../repository/volunteer/VolunteerItemRepository')();
var userRepository = require('../../repository/user/UserRepository')();

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/admin/login');
};

router.get('/user-detail/:userId', isAuthenticated, function(req,res){
    var result = {};
    var queryString='SELECT * FROM user where '+req.params.userId;
    console.log(queryString);
    query.execute(queryString, function (userInfo) {
        result.userInfo =userInfo;
        res.render('admin/user-detail.ejs', {result : result, moment : moment});
    });
});

//[봉사 등록]
//userId 주면 해당 유저가 최근 7일 동안 등록한 봉사 개수 반환
/*router.get('/volunteer-count/weekly/standby/:userId', function (request, response) {
    var result = {};
    var userId = request.params.userId;
    userRepository.selectType(userId,function (type) {
        var userType = type[0].userType;
        console.log('user type is ',userType);
        if(userType ==='helper'){
            console.log('해당 유저는 heler로써 봉사를 등록하지 않습니다.');
            response.send(JSON.stringify(result));
        }
        else if(userType ==='helpee'){
            volunteerItemRepository.countWeeklyStandby(userId,function (standBy) {
                result.standBy = standBy;
                response.send(JSON.stringify(result));
            })
        }
    });
});*/
//(예시)/api/user/detail/volunteer-count/monthly/standby?userId=01087658765&&interval=1
//userId,interval 주면 해당 유저가 최근 (1,3,6)달 동안 등록한 봉사 개수 반환
/*router.get('/volunteer-count/monthly/standby', function (request, response) {
    var result = {};
    var userId = request.query.userId;
    var interval = request.query.interval;
    userRepository.selectType(userId,function (type) {
        var userType = type[0].userType;
        console.log('user type is ',userType);
        if(userType ==='helper'){
            console.log('해당 유저는 heler로써 봉사를 등록하지 않습니다.')
            response.send(JSON.stringify(result));
        }
        else if(userType ==='helpee'){
            volunteerItemRepository.countMonthlyStandby(userId,interval,function (standBy) {
                result.standBy = standBy;
                response.send(JSON.stringify(result));
            })
        }
    });
});*/

//[봉사 신청]
//userId 주면 해당 유저가 최근 1주일 동안 신청한 봉사 개수 반환
/*router.get('/volunteer-count/weekly/match/:userId', function (request, response) {
    var result = {};
    var userId = request.params.userId;
    volunteerItemRepository.countWeeklyMatch(userId,function (match) {
        result.match = match;
        response.send(JSON.stringify(result));
    })
});*/

//userId,interval 주면 해당 유저가 최근 (1,3,6)달 동안 신청한 봉사 개수 반환
/*router.get('/volunteer-count/monthly/match', function (request, response) {
    var result = {};
    var userId = request.query.userId;
    var interval = request.query.interval;
    volunteerItemRepository.countMonthlyMatch(userId,interval,function (match) {
        result.match = match;
        response.send(JSON.stringify(result));
    })
});*/
//[봉사 등록]
//userId 주면 해당 유저가 최근 1주일 동안 매칭 완료된 봉사 개수 반환
/*router.get('/volunteer-count/weekly/matched/:userId', function (request, response) {
    var result = {};
    var userId = request.params.userId;
    volunteerItemRepository.countWeeklyMatched(userId,function (matched) {
        result.match = matched;
        response.send(JSON.stringify(result));
    })
});*/
//userId,interval 주면 해당 유저가 최근 (1,3,6)달 동안 매칭 완료된 봉사 개수 반환
//[예]/api/user/detail/volunteer-count/monthly/matched?userId=01012341234&&interval=3
/*router.get('/volunteer-count/monthly/matched', function (request, response) {
    var result = {};
    var userId = request.query.userId;
    var interval = request.query.interval;
    volunteerItemRepository.countMonthlyMatched(userId,interval,function (matched) {
        result.matched = matched;
        response.send(JSON.stringify(result));
    })
});*/

//최근 1주일간 사용자의 봉사 현황(봉사 등록, 봉사 매칭중, 봉사 매칭 완료)
router.get('/volunteer-count/weekly/:userId', function (request, response) {
    var result = {};
    var userId = request.params.userId;
    userRepository.selectType(userId,function (type) {
        var userType = type[0].userType;
        console.log('user type is ',userType);
        if(userType ==='helper'){
            console.log('해당 유저는 heler로써 봉사를 등록하지 않습니다.');
            //response.send(JSON.stringify(result));
        }
        else if(userType ==='helpee'){
            volunteerItemRepository.countWeeklyStandby(userId,function (standBy) {
                result.standBy = standBy;
            });
        }
        volunteerItemRepository.countWeeklyMatch(userId,function (match) {
            result.match = match;
            volunteerItemRepository.countWeeklyMatched(userId,function (matched) {
                result.matched = matched;
                response.send(JSON.stringify(result));
            });
        });
    });
});

//(예시)/api/user/detail/volunteer-count/monthly?userId=01087658765&&interval=1
//userId,interval 주면 해당 유저가 최근 (1,3,6)달 동안 봉사 현황 반환
router.get('/volunteer-count/monthly', function (request, response) {
    var result = {};
    var userId = request.query.userId;
    var interval = request.query.interval;
    userRepository.selectType(userId,function (type) {
        var userType = type[0].userType;
        console.log('user type is ',userType);
        if(userType ==='helper'){
            console.log('해당 유저는 heler로써 봉사를 등록하지 않습니다.')
            //response.send(JSON.stringify(result));
        }
        else if(userType ==='helpee'){
            volunteerItemRepository.countMonthlyStandby(userId,interval,function (standBy) {
                result.standBy = standBy;
            });
        }
        volunteerItemRepository.countMonthlyMatch(userId,interval,function (match) {
            result.match = match;
            volunteerItemRepository.countMonthlyMatched(userId, interval, function (matched) {
                result.matched = matched;
                response.send(JSON.stringify(result));
            });
        });
    });
});
module.exports = router;
