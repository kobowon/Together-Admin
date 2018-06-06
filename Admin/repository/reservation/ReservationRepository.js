var query = require('../../db/db_wrap')();

module.exports = function () {
    return {
        countReservation : function (userId,callback) {
            var queryString = 'SELECT count(id) as count,longitude,latitude FROM reservation where helperId = ? group by id';
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
        //봉사 예약 찾기
        searchReservation : function (date,latitude,longitude,callback) {
            var queryString = 'select helperId from reservation where (fromDate<=? AND toDate>=?) order by SQRT( POW(latitude-?,2) + POW(longitude-?,2) ) limit 1';
            var data = [date,date,latitude,longitude];
            query.executeWithData(queryString,data,function (result) {
                callback(result);
            })
        }
    }
};

