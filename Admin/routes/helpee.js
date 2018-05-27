var express = require('express');
var router = express.Router();
var mysql_dbc = require('../db/db_con')();
var path = require('path');
var multer = require('multer');
var connectionPool = mysql_dbc.createPool();
var request = require('request');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        ///root/volma/Admin/uploads/
        cb(null, '/root/deploy/Admin/uploads/') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename : function (req, file, callback) {
        callback(null, Date.now() + '.' + 'jpeg' ); // 업로드할 파일의 이름을 원하는 것으로 바꿀 수 있다. ( 원본 파일명은 프로퍼티로 따로 갖고 있음.)
    }
})

var recordStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        ///root/volma/Admin/uploads/
        cb(null, '/root/deploy/Admin/uploads/') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename : function (req, file, callback) {
        callback(null, file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
    }
});

var upload = multer({ storage: storage });
var recordUpload = multer({ storage: recordStorage });

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

//회원가입
router.post('/signup', upload.single('userfile'), function (req, res) {// userfile이 form data의 key 가 된다.
    var img_path = req.file.filename;
    var user = {
        userId: req.body.userPhone,
        userPhone: req.body.userPhone,
        userType: 'helpee',
        profileImage: img_path
    }
    var deviceKey = req.body.deviceKey;
    //insert into user (deviceId,userId)
    //values((select id from device where deviceKey='111'),'12345');
    var params = [user.userId,user.userPhone,user.userType,user.profileImage,deviceKey];
    //device key 를 가지고 device table 뒤져서 id 가져오고 (select -> insert)
    connectionPool.getConnection(function (err, connection) {
        // Use the connection
        var stmt = 'INSERT INTO user (userId,userPhone,userType,profileImage,deviceId) values(?,?,?,?,(select id from device where deviceKey = ?))';
        connection.query(stmt, params, function (err, result) {
            // And done with the connection.
            connection.release();
            if (err) throw err;
            else {
                res.send('Uploaded! : ' + req.file); // object를 리턴함
                console.log('DB에 파일 삽입 완료(OkPacket)', result);
            }
        });
    });
    console.log('uploads 폴더에 삽입한 파일', req.file); // 콘솔(터미널)을 통해서 req.file Object 내용 확인 가능.
});


//회원 사진 변경
    router.put('/photo', upload.single('userfile'), function (req, res) {// userfile이 form data의 key 가 된다.
        var img_path = req.file.filename;
        var stmt = 'UPDATE user SET profileImage = ? where userPhone = ?';
        var params = [img_path, req.body.userPhone];
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
    router.get('/photo/:userPhone', function (req, res) {
        connectionPool.getConnection(function (err, connection) {
            // Use the connection
            connection.query('SELECT * FROM user where userPhone= ?', req.params.userPhone, function (err, result) {
                // And done with the connection.
                connection.release();
                if (err) throw err;
                res.send('http://210.89.191.125/photo/' + result[0].profileImage);
            });
        });
    });

//존재하는 유저인지 확인
    router.get('/user/:userPhone', function (req, res) {
        connectionPool.getConnection(function (err, connection) {
            // Use the connection
            connection.query('SELECT * FROM user where userPhone= ?', req.params.userPhone, function (err, result) {
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


//봉사날짜(date), 시간(time), 봉사종류(type), 봉사기간(duration), 위도(latitude), 경도(longitude), 핸드폰 번호(userPhone), 기타(content)

//자원봉사요청
    router.post('/volunteer', function (req, res) {
        var body = req.body;
        var VolunteerItem = {
            type: body.type,//outdoor
            helperId: "",//abc
            helpeeId: body.userPhone,//01087654321
            longitude: body.longitude,//127.038607
            latitude: body.latitude,//37.276905
            content: body.content,
            date: body.date,//2018-05-15
            time: body.time,//18:30:00
            duration: body.duration,//3
            matchingStatus: 0,
            startStatus: 0
        };
        connectionPool.getConnection(function (err, connection) {
            // Use the connection
            connection.query('INSERT INTO volunteeritem SET ?', VolunteerItem, function (err, result) {
                // And done with the connection.
                connection.release();
                if (err) throw err;
                res.send("Helpee request is inserted");
            });
        });
    });

//주변 자원봉사자들에게 푸시 보내기
router.get('/helpers/push',function (req,res) {
    console.log('쿼리문 : ',req.query);

    var latitude = req.query.latitude;
    var longitude = req.query.longitude;

    var stmt = 'select token from device' +
        'where id in (select deviceId as id from user where (userType=? AND SQRT(POW(latitude-?,2)+POW(longitude-?,2))<0.04))';
    console.log('query is' + stmt);
    var params = ["helper",latitude,longitude];

    connectionPool.getConnection(function(err, connection) {
        // Use the connection
        connection.query( stmt, params, function(err, result) {
            // And done with the connection.
            connection.release();
            if(err) throw err;
            else {///성공하면
                var i,length=Object.keys(result).length;
                for(i=0;i<=length-1;i++) {
                    sendMessageToUser(
                        result[i].token,                //받아온 토큰값들 넣고
                        {message: '당신 주변에 도움이 필요합니다!'}     //메세지 내용
                    );
                }
                res.send(JSON.stringify(result));
            }
        });
    });
});


//userPhone 에 맞고, startStatus = 0 인 volunteeritem 가져오기
    router.get('/volunteers/wait/:helpeeId', function (req, res) {
        var stmt = 'SELECT * FROM volunteeritem where helpeeId = ? AND (startStatus = ? OR startStatus = ?)';
        var params = [req.params.helpeeId,0,1];
        connectionPool.getConnection(function (err, connection) {
            // Use the connection
            connection.query(stmt, params, function (err, result) {
                // And done with the connection.
                connection.release();
                if (err) throw err;
                res.send(result);
            });
        });
    });
//자원봉사 삭제
    router.post('/volunteer/delete', function (req, res) {
        var stmt = 'delete from volunteeritem where volunteerId = ?';
        var volunteerId = parseInt(req.body.volunteerId);
        //var volunteerId = req.params.volunteerId;
        connectionPool.getConnection(function (err, connection) {
            // Use the connection
            connection.query(stmt, volunteerId, function (err, result) {
                // And done with the connection.
                connection.release();
                if (err) throw err;
                res.send(JSON.stringify(result));
            });
        });
    });

//봉사 매칭 완료(id 주면 matchingStatus =2 & volunteerId 에 존재하는 helper 한테 푸시 알람)
router.put('/volunteer/complete', function (req, res) {
    var stmt = 'UPDATE volunteeritem SET matchingStatus = ? WHERE volunteerId = ?';
    var params = [2,req.body.volunteerId];//2:매칭완료
    connectionPool.getConnection(function (err, connection) {
        // Use the connection
        connection.query(stmt, params, function (err, result) {
            // And done with the connection.
            //connection.release();
            if (err) throw err;
            var statement = 'select token from device where id=(select deviceId from user where userId = (select helperId from volunteeritem where volunteerId=?))';
            connection.query(statement, req.body.volunteerId, function (err, result) {
                // And done with the connection.
                connection.release();
                if (err) throw err;
                var token = result[0].token;
                console.log(token);
                sendMessageToUser(token,{ message: '매칭 완료'});
                res.send(JSON.stringify(result));
            });
        });
    });
});



//helperName 이름 가져오기
router.get('/helper/name/:userId', function (req, res) {
    connectionPool.getConnection(function (err, connection) {
        // Use the connection
        connection.query('SELECT helperName FROM user where userId= ?', req.params.userId, function (err, result) {
            // And done with the connection.
            connection.release();
            if (err) throw err;
            else {
                res.send(result);
            }
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

//봉사 시작(volunterId -> startStatus = 1 & helper 한테 푸시)
router.put('/volunteer/start', function (req, res) {
    var stmt = 'UPDATE volunteeritem SET startStatus = ? WHERE volunteerId = ?';
    var params = [1,req.body.volunteerId];
    connectionPool.getConnection(function (err, connection) {
        // Use the connection
        connection.query(stmt, params, function (err, result) {
            // And done with the connection.
            //connection.release();
            if (err) throw err;
            var statement = 'select token from device where id=(select deviceId from user where userId = (select helperId from volunteeritem where volunteerId=?))';
            connection.query(statement, req.body.volunteerId, function (err, result) {
                // And done with the connection.
                connection.release();
                if (err) throw err;
                var token = result[0].token;
                console.log(token);
                sendMessageToUser(token,{ message: '봉사 시작'});
                res.send(JSON.stringify(result));
            });
        });
    });
});

//위치 업데이트
//몇 시부터 몇 시까지 얘가 어디 있었지?
router.post('/location', function (req, res) {
    var body = req.body;
    var location = {
        helpeeLongitude : body.helpeeLongitude,
        helpeeLatitude : body.helpeeLatitude,
        helperLongitude : body.helperLongitude,
        helperLatitude : body.helperLatitude,
        volunteerId : body.volunteerId //FK
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

//피드백 작성 해야만 봉사 다시 등록할 수 있게 하는 용도
router.get('/volunteer/:helpeeId', function (req, res) {
    var stmt = 'select * from volunteeritem where acceptStatus = ? AND helpeeId = ? AND helpeeFeedbackContent is NULL';
    var params = ['wait',req.params.helpeeId];
    connectionPool.getConnection(function (err, connection) {
        // Use the connection
        connection.query(stmt,params, function (err, result) {
            // And done with the connection.
            connection.release();
            if (err) throw err;
            if(result == ""){
                res.send("");
            }
            else{
                res.send(JSON.stringify(result[0].volunteerId));
            }
            console.log(result);
        });
    });
});


//volunteerId, helpeeScore, 음성파일(이름 :volunteerId) ->  mp3
//score 등록 & 음성파일 저장
router.put('/record', recordUpload.single('recordfile'), function (req, res) {// userfile이 form data의 key 가 된다.
    //var img_path = req.file.filename;
    var stmt = 'UPDATE volunteeritem SET helpeeScore = ? where volunteerId = ?';
    var params = [req.body.helpeeScore, req.body.volunteerId];
    connectionPool.getConnection(function (err, connection) {
        // Use the connection
        connection.query(stmt, params, function (err, result) {
            // And done with the connection.
            connection.release();
            if (err) throw err;
            else {
                res.send('Update : ' + req.file); // object를 리턴함
                console.log('유저 음성파일 등록 완료');
            }
        });
        console.log('uploads 폴더에 업로드한 음성파일', req.file);
    });
});



module.exports = router;
