var query = require('../../db/db_wrap')();

module.exports = function () {
    return {
        selectListHelpeeScore: function (callback) {
            query.execute('select max(helpeeScore) as score , count(volunteerId) as count from volunteeritem group by helpeeScore'  ,  function (result) {
                callback(result);
            });
        },
        selectListHelperScore: function (callback) {
            query.execute('select max(helperScore) as score , count(volunteerId) as count from volunteeritem group by helperScore'  ,  function (result) {
                callback(result);
            });
        },

        //1주일 통계(1주일 동안 등록된 도움요청 개수)
        countWeeklyStandby : function (callback) {
            var queryString = 'SELECT DATE_FORMAT(createdAt , \'%m-%d\') w_date, COUNT(volunteerId) AS count FROM volunteeritem WHERE date(createdAt) > DATE_ADD(now(), INTERVAL -7 day) GROUP BY w_date;';
            query.execute(queryString,function (result) {
                callback(result);
            })
        },
        //1주일 통계(1주일 동안 신청된 봉사 개수)
        countWeeklyMatch : function (callback) {
            var queryString = 'SELECT DATE_FORMAT(matchAt , \'%m-%d\') w_date, COUNT(volunteerId) AS count FROM volunteeritem WHERE date(matchAt) > DATE_ADD(now(), INTERVAL -7 day) GROUP BY w_date;';
            query.execute(queryString,function (result) {
                callback(result);
            })
        },
        //1주일 통계(1주일 동안 매칭 완료된 봉사 개수)
        countWeeklyMatched : function (callback) {
            var queryString = 'SELECT DATE_FORMAT(matchedAt , \'%m-%d\') w_date, COUNT(volunteerId) AS count FROM volunteeritem WHERE date(matchedAt) > DATE_ADD(now(), INTERVAL -7 day) GROUP BY w_date;';
            query.execute(queryString,function (result) {
                callback(result);
            })
        },

        selectListTodayByStandby : function (callback) {
            var queryString = 'select\n' +
                '  content\n' +
                '  ,latitude\n' +
                '  ,longitude\n' +
                '  ,helpeeId\n' +
                'from volunteeritem\n' +
                'where TO_DAYS(NOW()) - TO_DAYS(createdAt) <= 1 and matchingStatus = 0';

            query.execute(queryString , function (result) {
               callback(result);
            });
        },
        selectListTodayByMatch : function (callback) {
            var queryString = 'select\n' +
                '  content\n' +
                '  ,latitude\n' +
                '  ,longitude\n' +
                '  ,helpeeId\n' +
                '  ,helperId\n' +
                '  ,(select user.name from user where user.userId = helperId) as helperName\n' +
                'from volunteeritem\n' +
                'where TO_DAYS(NOW()) - TO_DAYS(createdAt) <= 1 and matchingStatus = 1';

            query.execute(queryString , function (result) {
                callback(result);
            });
        },
        selectListTodayByMatched : function (callback) {
            var queryString = 'select\n' +
                '  content\n' +
                '  ,latitude\n' +
                '  ,longitude\n' +
                '  ,helpeeId\n' +
                '  ,helperId\n' +
                '  ,(select user.name from user where user.userId = helperId) as helperName\n' +
                'from volunteeritem\n' +
                'where TO_DAYS(NOW()) - TO_DAYS(createdAt) <= 1 and matchingStatus = 2';

            query.execute(queryString , function (result) {
                callback(result);
            });
        },
        selectListStandbyWeekly : function (callback) {
            var queryString = 'select\n' +
                '  content\n' +
                '  ,latitude\n' +
                '  ,longitude\n' +
                '  ,helpeeId\n' +
                'from volunteeritem\n' +
                'where TO_DAYS(NOW()) - TO_DAYS(createdAt) <= 7 and matchingStatus = 0';

            query.execute(queryString , function (result) {
                callback(result);
            });
        },
        selectListMatchWeekly : function (callback) {
            var queryString = 'select\n' +
                '  content\n' +
                '  ,latitude\n' +
                '  ,longitude\n' +
                '  ,helpeeId\n' +
                '  ,helperId\n' +
                '  ,(select user.name from user where user.userId = helperId) as helperName\n' +
                'from volunteeritem\n' +
                'where TO_DAYS(NOW()) - TO_DAYS(createdAt) <= 7 and matchingStatus = 1';

            query.execute(queryString , function (result) {
                callback(result);
            });
        },
        selectListMatchedWeekly : function (callback) {
            var queryString = 'select\n' +
                '  content\n' +
                '  ,latitude\n' +
                '  ,longitude\n' +
                '  ,helpeeId\n' +
                '  ,helperId\n' +
                '  ,(select user.name from user where user.userId = helperId) as helperName\n' +
                'from volunteeritem\n' +
                'where TO_DAYS(NOW()) - TO_DAYS(createdAt) <= 7 and matchingStatus = 2';

            query.execute(queryString , function (result) {
                callback(result);
            });
        }
    }
};