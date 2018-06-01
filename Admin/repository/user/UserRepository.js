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
            var queryString = 'select userType from user where id = ?'
            query.executeWithData(queryString,userId,function (result) {
                callback(result);
            });
        },
        //countWeeklyStandby
        //countWeeklyMatch
        //countWeeklyMatched
        countHelpeeWeeklyStandby: function (userId,callback) {
            var queryString = 'select DATE_FORMAT(createdAt,\'%m-%d\') as w_date, count(volunteerId) as count' +
                ' from volunteeritem' +
                ' where helpeeId = ? AND date(createdAt) > DATE_ADD(now(), INTERVAL-7day) GROUP BY w_date';
            query.executeWithData(queryString,userId,function (result) {
                callback(result);
            });
        },
        countHelpeeWeeklyMatch: function (userId,callback) {
            var queryString = 'select DATE_FORMAT(matchAt,\'%m-%d\') as w_date, count(volunteerId) as count' +
                ' from volunteeritem' +
                ' where helpeeId = ? AND date(matchAt) > DATE_ADD(now(), INTERVAL-7day) GROUP BY w_date';
            query.executeWithData(queryString,userId,function (result) {
                callback(result);
            });
        },
        countHelpeeWeeklyMatched: function (userId,callback) {
            var queryString = 'select DATE_FORMAT(matchedAt,\'%m-%d\') as w_date, count(volunteerId) as count' +
                ' from volunteeritem' +
                ' where helpeeId = ? AND date(matchedAt) > DATE_ADD(now(), INTERVAL-7day) GROUP BY w_date';
            query.executeWithData(queryString,userId,function (result) {
                callback(result);
            });
        }


    }
};