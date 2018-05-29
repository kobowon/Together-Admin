var query = require('../../db/db_wrap')();

module.exports = function () {
    return {
        save: function (uri , callback) {
            query.executeWithData('insert into user_access (uri) values (?)' , uri  ,  function (result) {
               callback(result);
            });
        },
        selectListByWeekly: function (callback) {
            var query = 'SELECT DATE_FORMAT(createdAt , "%d") as date ,  count(id) as accessCount FROM user_access where TO_DAYS(NOW()) - TO_DAYS(createdAt) <= 7 group by createdAt';
            query.execute(query , function (result) {
                callback(result);
            });
        }
    }
};