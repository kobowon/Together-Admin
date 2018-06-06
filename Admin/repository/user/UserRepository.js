var query = require('../../db/db_wrap')();

module.exports = function () {
    return {
        countTotalUser : function (callback) {
            var queryString = 'SELECT count(userId) as count FROM user where userType!=\'admin\';'
            query.execute(queryString, function (result) {
                callback(result);
            });
        },
        countTotalHelper :function (callback) {
            var queryString = 'SELECT count(userId) as count FROM volma.user where userType=\'helper\';'
            query.execute(queryString, function (result) {
                callback(result);
            });
        },
        countTotalHelpee :function (callback) {
            var queryString = 'SELECT count(userId) as count FROM volma.user where userType=\'helpee\';'
            query.execute(queryString, function (result) {
                callback(result);
            });
        },

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
        selectHelpee : function (phoneNumber , callback) {
            var queryString = 'select\n' +
                '  userPhone,\n' +
                '  userNumber,\n' +
                '  userId,\n' +
                '  name,\n' +
                '  gender\n' +
                'from user\n' +
                'where userId = ?';

            var data = [phoneNumber];
            console.log(queryString);
            console.log(data);
            query.executeWithData(queryString,data,function (result) {
                console.log("selectHelpee" , result);
                if (result.length > 0) {
                    callback(result[0]);
                } else {
                    callback(null);
                }

            });
        },

        saveHelpee : function (param , callback) {

            var data = [param.phoneNumber , param.name , param.phoneNumber , 'helpee' , param.deviceId , param.age];
            var queryString = 'INSERT INTO user (userId , name , userPhone , userType , deviceId , age) values (?,?,?,?,?,?)';
            query.executeWithData(queryString , data , function () {
                callback();
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
        },
        pause: function (userId,callback) {
            var queryString = 'update user set pauseStatus = ? where userId = ?';
            var params = ['pause',userId];
            query.executeWithData(queryString,params,function (result) {
                callback(result);
            });
        },
        release: function (userId,callback) {
            var queryString = 'update user set pauseStatus = ? where userId = ?';
            var params = ['available',userId];
            query.executeWithData(queryString,params,function (result) {
                callback(result);
            });
        },
        checkPause: function (userId,callback) {
            var queryString = 'select pauseStatus from user where userId = ?';
            query.executeWithData(queryString,userId,function (result) {
                callback(result);
            });
        },
        selectRencentUser: function (callback) {
            var queryString = 'select * from user order by date(now())-date(createdAt) limit 5';
            query.execute(queryString,function (result) {
                callback(result);
            })
        },
        selectLowScoreUser: function (callback) {
            var queryString = 'select * from user where userType!=? and volunteerNumber>=1 order by userFeedbackScore limit 5';
            query.executeWithData(queryString,'admin',function (result) {
                callback(result);
            })
        }
    }
};