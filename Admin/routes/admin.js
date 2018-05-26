var express = require('express');
var router = express.Router();
var mysql_dbc = require('../db/db_con')();
var path = require('path');
var connectionPool = mysql_dbc.createPool();
var request = require('request');
var bcrypt = require('bcrypt');

//FCM
function sendMessageToUser(deviceId, message) {
    request({
        url: 'https://fcm.googleapis.com/fcm/send',
        method: 'POST',
        headers: {
            'Content-Type': ' application/json',
            'Authorization': 'key=AIzaSyDMeg6PyMznHfpGK1qeNbSwuZquAYgCKaE'
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

//모든 디바이스 가져오기
router.get('/devices', function (req, res) {
    var stmt = 'select * from device';
    connectionPool.getConnection(function (err, connection) {
        // Use the connection
        connection.query(stmt, function (err, result) {
            // And done with the connection.
            connection.release();
            if (err) throw err;
            res.send(JSON.stringify(result));
        });
    });
});


//모든 유저 가져오기
    router.get('/users', function (req, res) {

        var stmt = 'select * from user';
        connectionPool.getConnection(function (err, connection) {
            // Use the connection
            connection.query(stmt, function (err, result) {
                // And done with the connection.
                connection.release();
                if (err) throw err;
                res.send(JSON.stringify(result));
            });
        });
    });


//모든 봉사리스트 가져오기
    router.get('/volunteers', function (req, res) {

        var stmt = 'select * from volunteeritem';

        connectionPool.getConnection(function (err, connection) {
            // Use the connection
            connection.query(stmt, function (err, result) {
                // And done with the connection.
                connection.release();
                if (err) throw err;
                res.send(JSON.stringify(result));
            });
        });
    })


//initID로 시작하는 UserList 가져오기
    router.get('/users/init-id/:initId', function (req, res) {
        console.log(req.params.initId);
        var stmt = 'select * from user where userId regexp \'^' + req.params.initId + '\'';

        connectionPool.getConnection(function (err, connection) {
            // Use the connection
            connection.query(stmt, function (err, result) {
                // And done with the connection.
                connection.release();
                if (err) throw err;
                res.send(JSON.stringify(result));
            });
        });
    })


//userId 로 봉사리스트 가져오기
    router.get('/volunteers/user-id/:userId', function (req, res) {
        console.log(req.params.userId);
        var stmt = 'select * from volunteeritem where helperId = ? OR helpeeId = ?';
        var params = [req.params.userId, req.params.userId];
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


//volunteer_id 로 봉사리스트 가져오기
    router.get('/volunteers/volunteer-id/:volunteerId', function (req, res) {
        console.log(req.params.volunteerId);
        var stmt = 'select * from volunteeritem where volunteerId = ?';
        connectionPool.getConnection(function (err, connection) {
            // Use the connection
            connection.query(stmt, req.params.volunteerId, function (err, result) {
                // And done with the connection.
                connection.release();
                if (err) throw err;
                res.send(JSON.stringify(result));
            });
        });
    });


//userID로 유저에서 삭제
//{"userId": "tt"} 이런 형태로 post 처럼 보내면 됨
    router.delete('/user', function (req, res) {
        var stmt = 'DELETE FROM user WHERE userId = ?';
        connectionPool.getConnection(function (err, connection) {
            // Use the connection
            connection.query(stmt, req.body.userId, function (err, result) {
                // And done with the connection.
                connection.release();
                if (err) throw err;
                res.send(JSON.stringify(result));
            });
        });
    });

//volunteer_id 로 승인 대기 중/승인완료/승인거부 봉사리스트 가져오기
//acceptStatus = 'wait' 'accept' 'reject'로 줄 것 varchar(20)
    router.get('/volunteers/accept-status/:acceptStatus', function (req, res) {
        var acceptStatus = req.params.acceptStatus;
        var stmt = 'select * from volunteeritem where acceptStatus = ?';
        connectionPool.getConnection(function (err, connection) {
            // Use the connection
            connection.query(stmt, acceptStatus, function (err, result) {
                // And done with the connection.
                connection.release();
                if (err) throw err;
                res.send(JSON.stringify(result));
            });
        });
    });//now()

//봉사 승인 {"volunteer_id" : 1}과 같이 데이터 보내면 됨
    router.put('/volunteer/accept', function (req, res) {
        var stmt = 'update volunteeritem set acceptStatus=? where volunteerId=?';
        var params = ['accept', req.body.volunteerId];
        connectionPool.getConnection(function (err, connection) {
            // Use the connection
            connection.query(stmt, params, function (err, result) {
                // And done with the connection.
                connection.release();
                if (err) throw err;
                var statement = 'select token from device where id=(select deviceId from user where userId = (select helperId from volunteeritem where volunteerId=?))';
                connection.query(statement, req.body.volunteerId, function (err, result) {
                    // And done with the connection.
                    connection.release();
                    if (err) throw err;
                    var token = result[0].token;
                    console.log(token);
                    sendMessageToUser(token,{ message: '봉사 승인'});
                    res.send(JSON.stringify(result));
                });
            });
        });
    });

//봉사 거부 {"volunteer_id" : 1}과 같이 데이터 보내면 됨
    router.put('/volunteer/reject', function (req, res) {
        var stmt = 'update volunteeritem set acceptStatus=? where volunteerId=?';
        var params = ['reject', req.body.volunteerId];
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
//봉사 승인 대기상태로 돌리기 {"volunteer_id" : 1}과 같이 데이터 보내면 됨
    router.put('/volunteer/wait', function (req, res) {
        var stmt = 'update volunteeritem set acceptStatus=? where volunteerId=?';
        var params = ['wait', req.body.volunteerId];
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

//로그인
router.post('/login', function (req, res, next) {
    var userId = req.body.userId;
    var adminPwd = req.body.adminPwd;
    connectionPool.getConnection(function (err, connection) {
        // Use the connection
        var stmt = 'select * from user where userId = ?';
        connection.query(stmt,userId, function (err, result) {
            connection.release();
            if (err) {
                console.log('err :' + err);
            }
            else {
                if (result.length === 0) {
                    res.json({success: false, msg: '해당 유저가 존재하지 않습니다.'})
                }
                else {
                    if (!bcrypt.compareSync(adminPwd, result[0].adminPwd)) {
                        res.json({success: false, msg: '비밀번호가 일치하지 않습니다.'})
                    }
                    else {
                        res.json({success: true})
                    }
                }
            }
        });
    });
});

var location = {
    helpeeLongitude : body.helpeeLongitude,
    helpeeLatitude : body.helpeeLatitude,
    helperLongitude : body.helperLongitude,
    helperLatitude : body.helperLatitude,
    volunteerId : body.volunteerId,
    date : Date.now()
};

//관리자 -> user Id & 시간 주면 -> 시간 비교해서 위치 반환
//관리자 -> volunteer Id 주면 volunteer Id 의 시작, 종료
router.get('/location/:volunteerId', function (req, res) {
    var stmt = 'select * from location where volunteerId = ?';
    connectionPool.getConnection(function (err, connection) {
        // Use the connection
        connection.query(stmt,req.params.volunteerId, function (err, result) {
            // And done with the connection.
            connection.release();
            if (err) throw err;
            res.send(JSON.stringify(result));
        });
    });
});


    module.exports = router;
