var express = require('express');
var router = express.Router();
var mysql_dbc = require('../db/db_con')();
var path = require('path');
var connectionPool = mysql_dbc.createPool();

//FCM
function sendMessageToUser(deviceId, message) {
    request({
        url: 'https://fcm.googleapis.com/fcm/send',
        method: 'POST',
        headers: {
            'Content-Type': ' application/json',
            'Authorization': 'key=AI...8o'
        },
        body: JSON.stringify(
            {
                "data": {
                    "message": message
                },
                "to": deviceId
            }
        )
    }, function (error, response, body) {
        if (error) {
            console.error(error, response, body);
        }
        else if (response.statusCode >= 400) {
            console.error('HTTP Error: ' + response.statusCode + ' - ' + response.statusMessage + '\n' + body);
        }
        else {
            console.log('Done!')
        }
    });
}

//token , deviceKey 저장
router.post('/device/save', function (req, res) {
    var body = req.body;
    var device = {
        token: body.token,
        deviceKey: body.deviceKey
    };
    var stmt = 'INSERT INTO device SET ?';
    connectionPool.getConnection(function (err, connection) {
        // Use the connection
        connection.query(stmt, device, function (err, result) {
            // And done with the connection.
            connection.release();
            if (err) throw err;
            res.send("device info save");
        });
    });
});

//회원가입
    router.post('/signup', function (req, res) {
        var body = req.body;
        var user = {
            userId: body.userId,
            helperPwd: body.helperPwd,
            helperName: body.helperName,
            userPhone: body.userPhone,
            userType: 'helper',
            userFeedbackScore: body.userFeedbackScore,
            profileImage: body.profileImage,
            helpeeLatitude: body.helpeeLatitude,
            helpeeLongitude: body.helpeeLongitude,
            deviceKey:body.deviceKey
        };
        var stmt = 'select *from user where userId = ?';
        connectionPool.getConnection(function (err, connection) {
            // Use the connection
            connection.query(stmt, body.userId, function (err, result) {
                // And done with the connection.
                connection.release();
                if (err) throw err;
                else {
                    if (result.length === 1){
                        res.send("duplication");
                    }
                    else{//아이디 중복이 아니면
                        // var stmt = 'INSERT INTO user (userId,userPhone,userType,profileImage,deviceId) values(?,?,?,?,(select id from device where deviceKey = ?))';
                        var statement = 'INSERT INTO user (userId,helperPwd,helperName,userPhone,userType,userFeedbackScore,profileImage,helpeeLatitude,helpeeLongitude,deviceId)' +
                            'values(?,?,?,?,?,?,?,?,?,(select id from device where deviceKey = ?))';
                        var params = [user.userId,user.helperPwd,user.helperName,user.userPhone,user.userType,user.userFeedbackScore,user.profileImage,user.helpeeLatitude,user.helpeeLongitude,user.deviceKey];
                        connection.query(statement,params,function (err, result) {
                            connection.release();
                            if (err) {
                                throw err;
                            }
                            res.send("success");
                        })
                    }
                }
            });
        });
    });


//자원봉사자 로그인
    router.post('/login', function (req, res) {
        var stmt = 'select *from user where userId = ? AND helperPwd = ?';
        var params = [req.body.userId, req.body.helperPwd];
        connectionPool.getConnection(function (err, connection) {
            // Use the connection
            connection.query(stmt, params, function (err, result) {
                // And done with the connection.
                connection.release();
                if (err) throw err;
                else {
                    if (result.length === 0) {
                        res.send("fail");
                    }
                    else {
                        res.send("success");
                    }
                }
            });
        });
    });


//자원봉사리스트 가져오기
    router.get('/volunteers', function (req, res) {
        var stmt = 'select * from volunteeritem where startStatus = ? OR startStatus = ?';
        var params = [0, 1];
        connectionPool.getConnection(function (err, connection) {
            // Use the connection
            connection.query(stmt, params, function (err, result) {
                // And done with the connection.
                connection.release();
                if (err) throw err;
                res.send(JSON.stringify(result));
            });
        });
    });

//Helper_ID 가 속해있는 자원봉사리스트 가져오기
    router.get('/volunteers/:helperId', function (req, res) {
        var stmt = 'select * from volunteeritem where helperId = ?';
        connectionPool.getConnection(function (err, connection) {
            // Use the connection
            connection.query(stmt, req.params.helperId, function (err, result) {
                // And done with the connection.
                connection.release();
                if (err) throw err;
                res.send(JSON.stringify(result));
            });
        });
    });

//userID로 사용자 정보 검색
    router.get('/user/:userId', function (req, res) {
        var stmt = 'select * from user where userId = ?';
        var params = [req.params.userId];
        connectionPool.getConnection(function (err, connection) {
            // Use the connection
            connection.query(stmt, params, function (err, result) {
                // And done with the connection.
                connection.release();
                if (err) throw err;
                res.send(JSON.stringify(result));
            });
        });
    });

//봉사 신청하기 하는중.....
//봉사 신청 > volunteerId에 해당하는 helpee의 deviceId 를 찾아서(select)
//deviceId를 deviceTable의 id로 사용해서 token 찾아오기(select)
    router.put('/volunteer/assign', function (req, res) {
        var stmt = 'UPDATE volunteeritem SET matchingStatus = ?,helperId=? WHERE volunteerId = ?';
        var params = [1, req.body.helperId, req.body.volunteerId];//1:매칭중
        connectionPool.getConnection(function (err, connection) {
            // Use the connection
            connection.query(stmt, params, function (err, result) {
                // And done with the connection.
                connection.release();
                if (err) throw err;
                res.send(JSON.stringify(result));
            });
        });
    })

//봉사 신청하기 취소
    router.put('/volunteer/assign/cancel', function (req, res) {
        var stmt = 'UPDATE volunteeritem SET matchingStatus = ?,helperId=? WHERE volunteerId = ?';
        var params = [0, "", req.body.volunteerId];//0:매칭 대기중
        connectionPool.getConnection(function (err, connection) {
            // Use the connection
            connection.query(stmt, params, function (err, result) {
                // And done with the connection.
                connection.release();
                if (err) throw err;
                res.send(JSON.stringify(result));
            });
        });
    });

//맞춤 검색
    router.get('/volunteer/search', function (req, res) {
        console.log('쿼리문 : ', req.query);
        console.log('fromDate', req.query.fromDate);
        console.log('fromTime', req.query.fromTime);

        var fromDate = req.query.fromDate;
        //var fromDate = '2018-01-01';
        var toDate = req.query.toDate;
        //var toDate = '2018-06-06';
        var fromTime = req.query.fromTime;
        //var fromTime  = '09:00';
        var toTime = req.query.toTime;
        //var toTime = '20:00';
        var latitude = req.query.latitude;
        var longitude = req.query.longitude;
        //var latitude = 37.276900;
        //var longitude = 127.038535;
        var volunteerType = req.query.volunteerType;
        //var volunteerType = 'lyrics';
        var stmt = 'select * from volunteeritem' +
            ' where (matchingStatus = 0 AND SQRT(POW(latitude-?,2)+POW(longitude-?,2))<0.04)' +
            ' AND (date >= ? AND date <= ?) ' +
            ' AND (time >= ? AND time <= ?) AND (type=?)';
        console.log('query is' + stmt);
        var params = [latitude, longitude, fromDate, toDate, fromTime, toTime, volunteerType];

        connectionPool.getConnection(function (err, connection) {
            // Use the connection
            connection.query(stmt, params, function (err, result) {
                // And done with the connection.
                connection.release();
                if (err) throw err;
                console.log(result);
                res.send(JSON.stringify(result));
            });
        });
    });

//deviceKey 있으면 true 없으면 false
router.get('/device/:deviceKey', function (req, res) {
    connectionPool.getConnection(function (err, connection) {
        // Use the connection
        connection.query('SELECT * FROM device where deviceKey= ?', req.params.deviceKey, function (err, result) {
            // And done with the connection.
            connection.release();
            if (err) throw err;
            else {
                if (result.length == 0) {
                    res.send('false');
                }
                else {
                    res.send('true');
                }
            }
        });
    });
});

//token 변경
router.put('/token/update', function (req, res) {
    var stmt = 'UPDATE device SET token = ? WHERE deviceKey = ?';
    var params = [req.body.token,req.body.deviceKey];
    connectionPool.getConnection(function (err, connection) {
        // Use the connection
        connection.query(stmt, params, function (err, result) {
            // And done with the connection.
            connection.release();
            if (err) throw err;
            res.send(JSON.stringify(result));
        });
    });
});


    module.exports = router;

