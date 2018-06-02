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
        selectUser : function (userId,callback) {
            var queryString = 'select * from user where userId = ?';
            query.executeWithData(queryString,userId,function (result) {
                callback(result);
            });
        },
        updateDropHelpee: function (userId,callback) {
            var queryString = 'update volunteeritem set helpeeId = ? where helpeeId = ?';
            var params = ['drop',userId];
            query.executeWithData(queryString,params,function (result) {
                callback(result);
            })
        },
        updateDropHelper: function (userId,callback) {
            var queryString = 'update volunteeritem set helperId = ? where helperId = ?';
            var params = ['drop',userId];
            query.executeWithData(queryString,params,function (result) {
                callback(result);
            })
        }
        
    }
};