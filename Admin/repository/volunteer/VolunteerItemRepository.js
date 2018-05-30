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

        }
    }
};