var query = require('../../db/db_wrap')();

module.exports = function () {
    return {
        countReservation : function (userId,callback) {
            var queryString = 'SELECT count(id) as count FROM reservation where helperId = ?';
            query.executeWithData(queryString,userId,function (result) {
                callback(result);
            })
        },
        cancelReservation : function (userId,callback) {
            var queryString = 'delete from reservation where helperId = ?';
            query.executeWithData(queryString,userId,function (result) {
                callback(result);
            })
        },
    }
};

