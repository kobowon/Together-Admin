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
        selectListByWeekly : function (callback) {

        },
        selectListTodayByStandby : function (callback) {
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
        selectListTodayByMatch : function (callback) {
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
        selectListTodayByMatched : function (callback) {
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