var query = require('../../db/db_wrap')();

module.exports = function () {
    return {
        save : function (deviceId , token , callback) {
            debugger;
            var queryString = 'insert into device (deviceKey , token) values (? , ?)';
            var data = [deviceId , token];
            query.executeWithData(queryString , data , function () {
                callback();
            });
        } , 
        selectOne : function (deviceId , callback) {
            var queryString = 'select * from  device where deviceKey = ?';
            var data = [deviceId];
            query.executeWithData(queryString , data , function (result) {
                callback(result);
            });
        } ,
        updateToken : function (deviceId , token , callback) {
            debugger;
            var queryString = 'update  device set token = ? , updatedAt = now() where deviceKey = ?';
            var data = [token , deviceId];
            query.executeWithData(queryString , data , function () {
                callback();
            });
        }
    }
};