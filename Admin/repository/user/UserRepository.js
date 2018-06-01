var query = require('../../db/db_wrap')();

module.exports = function () {
    return {

        selectListByWeekly: function (callback) {
            var queryString = '\n' +
                'select DATE_FORMAT(createdAt , \'%m-%d\') as date ,    count(userId) as count from (\n' +
                '  SELECT *  FROM user where TO_DAYS(NOW()) - TO_DAYS(createdAt) <= 7\n' +
                ') as weekly  group by date;';
            query.execute(queryString , function (result) {
                callback(result);
            });
        },
        //유저 id 넘기면 해당 type 가져오기
        selectType: function (userId, callback) {
            var queryString = 'select userType from user where userId = ?'
            query.executeWithData(queryString,userId,function (result) {
                callback(result);
            });
        },
        //countWeeklyStandby
        //countWeeklyMatch
        //countWeeklyMatched

        /*****봉사 등록*******/
        //1주일 간 특정 사용자가 요청한(봉사 등록)봉사 수(Helpee만 사용)
        countWeeklyStandby: function (userId,callback) {
            var queryString = 'select DATE_FORMAT(createdAt,\'%m-%d\') as w_date, count(volunteerId) as count ' +
                'from volunteeritem where helpeeId = ? AND date(createdAt) > DATE_ADD(now(), INTERVAL-7 day) GROUP BY w_date';
            query.executeWithData(queryString,userId,function (result) {
                callback(result);
            });
        },
        //(1,3,6)달 간 특정 사용자가 요청한(봉사 등록)봉사 수(Helpee만 사용)
        countMonthlyStandby: function (userId,interval,callback) {
            var queryString = 'select DATE_FORMAT(createdAt,\'%m-%d\') as w_date, count(volunteerId) as count' +
                ' from volunteeritem' +
                ' where helpeeId = ? AND date(createdAt) > DATE_ADD(now(), INTERVAL-'+interval+' month) GROUP BY w_date';
            query.executeWithData(queryString,userId,function (result) {
                callback(result);
            });
        },

        /*****봉사 신청*******/
        //1주일 간 특정 사용자가 신청한(봉사 신청)봉사 수(Helpee,Helper사용)
        countWeeklyMatch: function (userId,callback) {
            var queryString = 'select DATE_FORMAT(matchAt,\'%m-%d\') as w_date, count(volunteerId) as count' +
                ' from volunteeritem' +
                ' where (helpeeId = ? OR helperId = ?) AND date(matchAt) > DATE_ADD(now(), INTERVAL-7 day) GROUP BY w_date';
            var parms = [userId, userId];
            query.executeWithData(queryString,parms,function (result) {
                callback(result);
            });
        },
        //(1,3,6)달 간 특정 사용자가 신청한(봉사 신청)봉사 수(Helpee,Helper사용)
        countMonthlyMatch: function (userId,interval,callback) {
            var queryString = 'select DATE_FORMAT(matchAt,\'%m-%d\') as w_date, count(volunteerId) as count' +
                ' from volunteeritem' +
                ' where (helpeeId = ? OR helperId = ?) AND date(matchAt) > DATE_ADD(now(), INTERVAL-'+interval+' month) GROUP BY w_date';
            var parms = [userId, userId];
            query.executeWithData(queryString,parms,function (result) {
                callback(result);
            });
        },
        /*****매칭 완료*******/
        //1주일 간 특정 사용자가 수행한(매칭완료)봉사 수(Helpee,Helper사용)
        countWeeklyMatched: function (userId,callback) {
            var queryString = 'select DATE_FORMAT(matchedAt,\'%m-%d\') as w_date, count(volunteerId) as count' +
                ' from volunteeritem' +
                ' where  (helpeeId = ? OR helperId = ?) AND date(matchedAt) > DATE_ADD(now(), INTERVAL-7 day) GROUP BY w_date';
            var parms = [userId, userId];
            query.executeWithData(queryString,parms,function (result) {
                callback(result);
            });
        },
        //(1,3,6)달 간 특정 사용자가 수행한(매칭완료)봉사 수(Helpee,Helper사용)
        countMonthlyMatched: function (userId,interval,callback) {
            var queryString = 'select DATE_FORMAT(matchedAt,\'%m-%d\') as w_date, count(volunteerId) as count' +
                ' from volunteeritem' +
                ' where (helpeeId = ? OR helperId = ?) AND date(matchedAt) > DATE_ADD(now(), INTERVAL-'+interval+' month) GROUP BY w_date';
            var parms = [userId, userId];
            query.executeWithData(queryString,parms,function (result) {
                callback(result);
            });

        }
    }
};