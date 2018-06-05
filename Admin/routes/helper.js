var express = require('express');
var router = express.Router();
var mysql_dbc = require('../db/db_con')();
var path = require('path');
var connectionPool = mysql_dbc.createPool();
var request = require('request');
var multer = require('multer');
var volunteerItemRepository = require('../repository/volunteer/VolunteerItemRepository')();
var userRepository = require('../repository/user/UserRepository')();
var reservationRepository = require('../repository/reservation/ReservationRepository')();
var deviceRepository = require('../repository/device/DeviceRepository')();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        ///root/volma/Admin/uploads/
        cb(null, '/root/deploy/Admin/uploads/') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename : function (req, file, callback) {
        callback(null, Date.now() + '.' + 'jpeg' ); // 업로드할 파일의 이름을 원하는 것으로 바꿀 수 있다. ( 원본 파일명은 프로퍼티로 따로 갖고 있음.)
    }
})

var upload = multer({ storage: storage });

//FCM
function sendMessageToUser(deviceId, message) {
    request({
        url: 'https://fcm.googleapis.com/fcm/send',
        method: 'POST',
        headers: {
            'Content-Type': ' application/json',
            'Authorization': 'key=AIzaSyB_ZBDgREdOLbikhId426EqWEmcGk-gex4'
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

//로딩 시 위도 경도 저장
router.put('/location/load', function (req, res) {
    var stmt = 'UPDATE user SET latitude = ?,longitude=? WHERE userId = ?';
    var params = [req.body.latitude, req.body.longitude, req.body.userId];
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

//회원가입
    router.post('/signup', function (req, res) {
        var body = req.body;
        var user = {
            userId: body.userId,
            helperPwd: body.helperPwd,
            name: body.helperName,
            userPhone: body.userId,
            userType: 'helper',
            userFeedbackScore: body.userFeedbackScore,
            profileImage: body.profileImage,
            latitude: body.helpeeLatitude,
            longitude: body.helpeeLongitude,
            deviceKey:body.deviceKey
        };
        var stmt = 'select *from user where userId = ?';
        connectionPool.getConnection(function (err, connection) {
            // Use the connection
            connection.query(stmt, body.userId, function (err, result) {
                // And done with the connection.
                //connection.release();
                if (err) throw err;
                else {
                    if (result.length === 1){
                        res.send("duplication");
                    }
                    else{//아이디 중복이 아니면
                        // var stmt = 'INSERT INTO user (userId,userPhone,userType,profileImage,deviceId) values(?,?,?,?,(select id from device where deviceKey = ?))';
                        var statement = 'INSERT INTO user (userId,helperPwd,name,userPhone,userType,userFeedbackScore,profileImage,latitude,longitude,deviceId)' +
                            'values(?,?,?,?,?,?,?,?,?,(select id from device where deviceKey = ?))';
                        var params = [user.userId,user.helperPwd,user.name,user.userPhone,user.userType,user.userFeedbackScore,user.profileImage,user.latitude,user.longitude,user.deviceKey];
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
        var stmt = 'select * from volunteeritem where helperId = ? AND (startStatus=? OR startStatus=?)';
        var params = [req.params.helperId,0, 1];
        connectionPool.getConnection(function (err, connection) {
            // Use the connection
            connection.query(stmt,params, function (err, result) {
                // And done with the connection.
                connection.release();
                if (err) throw err;
                res.send(JSON.stringify(result));
            });
        });
    });
//Helper_ID 가 속해있는 종료된 자원봉사리스트 가져오기
router.get('/finished-volunteers/:helperId', function (req, res) {
    var stmt = 'select * from volunteeritem where helperId = ? AND startStatus=?';
    var params = [req.params.helperId,2];
    connectionPool.getConnection(function (err, connection) {
        // Use the connection
        connection.query(stmt,params, function (err, result) {
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

//봉사 신청하기(volunteerId 주면 해당 봉사의 helpee token 가져온 후 푸시)
//봉사 신청 > volunteerId에 해당하는 helpee 가져오고 select helpeeId from volunteeritem where volunteerId = ?
// helpee의 deviceId 를 찾아서(select) select deviceId from user where userId = 위에 쿼리
//deviceId를 deviceTable의 id로 사용해서 token 찾아오기(select)   select token from device where id= 위에 쿼리
    router.put('/volunteer/assign', function (req, res) {
        var stmt = 'UPDATE volunteeritem SET matchingStatus = ?,helperId=? WHERE volunteerId = ?';
        var params = [1, req.body.helperId, req.body.volunteerId];//1:매칭중
        connectionPool.getConnection(function (err, connection) {
            // Use the connection
            connection.query(stmt, params, function (err, result) {
                // And done with the connection.
                //connection.release();
                if (err) throw err;
                var statement = 'select token from device where id=(select deviceId from user where userId = (select helpeeId from volunteeritem where volunteerId=?))';
                connection.query(statement, req.body.volunteerId, function (err, result) {
                    // And done with the connection.
                    connection.release();
                    if (err) throw err;
                    var token = result[0].token;
                    console.log(token);
                    sendMessageToUser(token,{ message: '자원봉사자가 봉사를 신청했습니다.'});
                    res.send(JSON.stringify(result));
                });
            });
        });
    });




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

//봉사 종료(volunteerId -> startStatus :2 , acceptStatus: wait & helpee 한테 푸시)
router.put('/volunteer/end', function (req, res) {
    var stmt = 'UPDATE volunteeritem SET startStatus = ?,acceptStatus=?,helperScore=?,helperFeedbackContent=? WHERE volunteerId = ?';
    var params = [2,'wait',req.body.helperScore,req.body.helperFeedbackContent,req.body.volunteerId];
    connectionPool.getConnection(function (err, connection){
        // Use the connection
        connection.query(stmt, params, function (err, result){
            // And done with the connection.
            if (err) throw err;
            stmt = 'select token from device where id=(select deviceId from user where userId = (select helpeeId from volunteeritem where volunteerId=?))';
            connection.query(stmt, req.body.volunteerId, function (err, result) {
                // And done with the connection.
                if (err) throw err;
                var token = result[0].token;
                console.log(token);
                sendMessageToUser(token,{ message: '봉사가 종료되었습니다'});
                //수정
                stmt = 'select date from location where volunteerId = ?';
                connection.query(stmt, req.body.volunteerId, function (err, result) {
                    // And done with the connection.
                    if (err) throw err;
                    var start = result[0].date;
                    var end = result[result.length - 1].date;
                    var time = (end - start) / (60 * 60 * 1000);
                    var admitTime = Math.ceil(time);
                    console.log('*****************************');
                    console.log('admitTime is ',admitTime);
                    console.log('*****************************');
                    stmt = 'update volunteeritem set realDuration = ?,endAt=? where volunteerId = ?';
                    params = [admitTime,end,req.body.volunteerId];
                    connection.query(stmt, params, function (err, result) {
                        // And done with the connection.
                        connection.release();
                        if (err) throw err;
                        res.send(JSON.stringify(result));
                    });
                });
            });
        });
    });
});

//위치 업데이트
router.post('/location', function (req, res) {
    var body = req.body;
    var location = {
        helpeeLongitude : body.helpeeLongitude,
        helpeeLatitude : body.helpeeLatitude,
        helperLongitude : body.helperLongitude,
        helperLatitude : body.helperLatitude,
        volunteerId : body.volunteerId
    };
    connectionPool.getConnection(function (err, connection) {
        // Use the connection
        connection.query('INSERT INTO location SET ?', location, function (err, result) {
            // And done with the connection.
            connection.release();
            if (err) throw err;
            res.send("location is inserted");
        });
    });
});



//회원 사진 변경
router.put('/photo', upload.single('userfile'), function (req, res) {// userfile이 form data의 key 가 된다.
    var img_path = req.file.filename;
    var stmt = 'UPDATE user SET profileImage = ? where userId = ?';
    var params = [img_path, req.body.userId];
    connectionPool.getConnection(function (err, connection) {
        // Use the connection
        connection.query(stmt, params, function (err, result) {
            // And done with the connection.
            connection.release();
            if (err) throw err;
            else {
                res.send('Update : ' + req.file); // object를 리턴함
                console.log('유저 사진 수정 완료');
            }
        });
        console.log('uploads 폴더에 수정한 파일', req.file);
    });
});

//회원 사진 가져오기
router.get('/photo/:userId', function (req, res) {
    connectionPool.getConnection(function (err, connection) {
        // Use the connection
        connection.query('SELECT * FROM user where userId = ?', req.params.userId, function (err, result) {
            // And done with the connection.
            connection.release();
            if (err) throw err;
            res.send('http://210.89.191.125/photo/' + result[0].profileImage);
        });
    });
});
//봉사 예약
router.post('/reserve', function (req, res) {
    var body = req.body;
    var reservation = {
        helperId : body.helperId,
        longitude : body.longitude,
        latitude : body.latitude,
        fromDate : body.fromDate,
        toDate : body.toDate
    };
    var stmt = 'INSERT INTO reservation SET ?';
    connectionPool.getConnection(function (err, connection) {
        connection.query(stmt, reservation, function (err, result) {
            connection.release();
            if (err) throw err;
            res.send(JSON.stringify(result));
        });
    });
});

//reservationRepository
router.get('/reservation/check/:userId',function (request,response) {
    var result = {};
    var userId = request.params.userId;
    reservationRepository.countReservation(userId,function (check) {
        response.send(JSON.stringify(check));
    })
});

router.post('/reservation/cancel',function (request,response) {
    var result = {};
    var userId = request.body.userId;
    reservationRepository.cancelReservation(userId,function (check) {
        response.send('delete complete');
    })
});

router.get('/pause/check/:userId',function (request,response) {
    var userId = request.params.userId;
    userRepository.checkPause(userId,function (pause) {
        response.send(pause[0].pauseStatus);
    })
})

module.exports = router;

