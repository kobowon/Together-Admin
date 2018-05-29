var query = require('../../db/db_wrap')();

module.exports = function () {
    return {
        save: function (uri , callback) {
            query.executeWithData('insert into user_access (uri) values (?)' , uri  ,  function (result) {
               callback(result);
            });
        },
        selectListByWeekly: function (callback) {
            var queryString = '\n' +
                'select DATE_FORMAT(createdAt , \'%m-%d\') as date , count(id) as accessCount from (\n' +
                '  SELECT *  FROM user_access where TO_DAYS(NOW()) - TO_DAYS(createdAt) <= 7\n' +
                ') as weekly  group by date';
            query.execute(queryString , function (result) {
                callback(result);
            });
        }
    }
};