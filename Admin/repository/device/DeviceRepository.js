var query = require('../../db/db_wrap')();

module.exports = function () {
    return {
        save : function (deviceId , token , phoneNumber ,  callback) {
            debugger;
            var queryString = 'insert into device (deviceKey , token , phoneNumber) values (? , ? , ?)';
            var data = [deviceId , token , phoneNumber];
            query.executeWithData(queryString , data , function () {
                callback();
            });
        } , 
        selectOne : function (deviceId , callback) {
            var queryString = 'select * from  device where deviceKey = ?';
            var data = [deviceId];
            query.executeWithData(queryString , data , function (result) {
                console.log(result);
                callback(result);
            });
        } ,
        updateToken : function (deviceId , token , phoneNumber, callback) {
            var queryString = 'update  device set token = ? , updatedAt = now() , phoneNumber = ? where deviceKey = ?';
            var data = [token ,phoneNumber , deviceId];
            query.executeWithData(queryString , data , function () {
                callback();
            });
        },
        selectAlarmDevice : function (helperId,helpeeId, callback) {
            var queryString = 'select token from device where Id in (select deviceId from user where userId = ? OR userId = ?)';
            var data = [helperId,helpeeId];
            query.executeWithData(queryString,data,function(token) {
                callback(token);
            })
        },
        selectHelperDevice : function (helperId,callback) {
            var queryString = 'select token from device where id = (select deviceId from user where userId=?)';
            var data = [helperId];
            query.executeWithData(queryString,data,function (token) {
                callback(token);
            })
        }
    }
};