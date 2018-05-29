var express = require('express');
var moment = require('moment');
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

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/admin/login');
};



router.get('/approve',isAuthenticated, function(req,res){
    res.render('admin/approve.html');
})

router.get('/login' , function (req , res) {
    res.render('admin/login.html');
})

router.get('/contact-manage',isAuthenticated, function(req,res){
    var stmt = 'select * from contact';
    connectionPool.getConnection(function (err, connection) {
        // Use the connection
        connection.query(stmt, function (err, result) {
            // And done with the connection.
            connection.release();

            if (err) throw err;
            res.render('admin/contact-manage.ejs' , {contactList : result , moment : moment});
        });
    });

})

router.get('/join-manage',isAuthenticated, function(req,res){
    res.render('admin/join-manage.html');
})

router.get('/usermanage',isAuthenticated, function(req,res){
    res.render('admin/usermanage.html' , {test:'aaa'});
})

router.get('/map' , function (req , res) {
    res.render('admin/map.html');
})


router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/admin/login');
});



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

        var stmt = 'select * from user where NOT userType = ?';
        connectionPool.getConnection(function (err, connection) {
            // Use the connection
            connection.query(stmt,'admin', function (err, result) {
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

//종료된 봉사리스트 가져오기
router.get('/volunteers/end', function (req, res) {
    var stmt = 'select * from volunteeritem where startStatus = ?';
    connectionPool.getConnection(function (err, connection) {
        // Use the connection
        connection.query(stmt,2, function (err, result) {
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
        var stmt = 'select * from user where userId regexp \'^' + req.params.initId + '\' AND (NOT userType = ?)';
        connectionPool.getConnection(function (err, connection) {
            // Use the connection
            connection.query(stmt,'admin', function (err, result) {
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
//volunteerId 로 봉사리스트 가져오기
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

/*//봉사 승인 {"volunteer_id" : 1}과 같이 데이터 보내면 됨
    router.put('/volunteer/accept', function (req, res) {
        var stmt = 'update volunteeritem set acceptStatus=? where volunteerId=?';
        var params = ['accept', req.body.volunteerId];
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
                    sendMessageToUser(token,{ message: '봉사 승인'});
                    res.send(JSON.stringify(result));
                });
            });
        });
    });*/
//시간 측정
router.get('/volunteer/time/:volunteerId', function (req, res) {
    var stmt = 'select date from location where volunteerId = ?';
    connectionPool.getConnection(function (err, connection) {
        // Use the connection
        connection.query(stmt,req.params.volunteerId, function (err, result) {
            // And done with the connection.
            connection.release();
            if (err) throw err;
            var start = result[0].date;
            var end = result[result.length-1].date;
            var time = (end-start)/(60*60*1000);
            var admitTime = Math.ceil(time);
            res.send(JSON.stringify(admitTime));
        });
    });
});
//봉사 승인
//user 테이블의 각 유저의  volunteerNumber를 증가시키고 userFeedbackScore 를 반영
router.put('/volunteer/accept', function (req, res) {
    var stmt = 'update volunteeritem set acceptStatus=? where volunteerId=?';
    var params = ['accept', req.body.volunteerId];
    connectionPool.getConnection(function (err, connection) {
        connection.query(stmt, params, function (err, result) {
            if (err) throw err;
            stmt = 'select token from device where id=(select deviceId from user where userId = (select helperId from volunteeritem where volunteerId=?))';
            connection.query(stmt, req.body.volunteerId, function (err, result) {
                if (err) throw err;
                var token = result[0].token;
                sendMessageToUser(token,{ message: '봉사 승인'});
                stmt =
                    'select userId,userType,volunteerNumber,userFeedbackScore ' +
                    'from user ' +
                    'where (userId = (select helperId from volunteeritem where volunteerId = ?)) OR (userId = (select helpeeId from volunteeritem where volunteerId = ?))';
                params = [req.body.volunteerId,req.body.volunteerId];
                connection.query(stmt,params, function (err, result) {
                    if (err) throw err;
                    console.log(result);

                    var helperScoreAve = result[0].userFeedbackScore;
                    var helperNum = result[0].volunteerNumber;
                    var helperId = result[0].userId;


                    var helpeeScoreAve = result[1].userFeedbackScore;
                    var helpeeNum = result[1].volunteerNumber;
                    var helpeeId = result[1].userId;

                    stmt = 'select helpeeScore,helperScore from volunteeritem where volunteerId = ?';
                    connection.query(stmt,req.body.volunteerId, function (err, result) {
                        //connection.release();
                        if (err) throw err;
                        console.log(result);
                        var helpeeScore = result[0].helpeeScore;
                        var helperScore = result[0].helperScore;

                        var helperNumUpdate = helperNum+1;
                        var helperScoreAveUpdate = (helperScoreAve* helperNum + helpeeScore)/helperNumUpdate;

                        var helpeeNumUpdate = helpeeNum+1;
                        var helpeeScoreAveUpdate = (helpeeScoreAve* helpeeNum + helperScore)/helpeeNumUpdate;

                        stmt = 'update user set userFeedbackScore = ?, volunteerNumber = ? where userId = ?';
                        params = [helperScoreAveUpdate,helperNumUpdate,helperId];
                        connection.query(stmt,params, function (err, result) {
                            if (err) throw err;
                            stmt = 'update user set userFeedbackScore = ?, volunteerNumber = ? where userId = ?';
                            params = [helpeeScoreAveUpdate,helpeeNumUpdate,helpeeId];
                            connection.query(stmt,params, function (err, result) {
                                connection.release();
                                if (err) throw err;
                                res.send(JSON.stringify(result));
                            });
                        });
                    });
                });
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
                if (err) throw err;
                stmt = 'select token from device where id=(select deviceId from user where userId = (select helperId from volunteeritem where volunteerId=?))';
                connection.query(stmt, req.body.volunteerId, function (err, result) {
                    // And done with the connection.
                    connection.release();
                    var token = result[0].token;
                    sendMessageToUser(token,{ message: '봉사 승인을 거부당했습니다.'});
                    if (err) throw err;
                    res.send(JSON.stringify(result));
                });
            });
        });
    });
/*//봉사 승인 취소 {"volunteer_id" : 1}과 같이 데이터 보내면 됨
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
    });*/

//봉사 승인 취소
router.put('/volunteer/wait', function (req, res) {
    var stmt = 'update volunteeritem set acceptStatus=? where volunteerId=?';
    var params = ['wait', req.body.volunteerId];
    connectionPool.getConnection(function (err, connection) {
        connection.query(stmt, params, function (err, result) {
            if (err) throw err;
            stmt = 'select token from device where id=(select deviceId from user where userId = (select helperId from volunteeritem where volunteerId=?))';
            connection.query(stmt, req.body.volunteerId, function (err, result) {
                if (err) throw err;
                var token = result[0].token;
                sendMessageToUser(token,{ message: '봉사 승인 취소'});
                stmt =
                    'select userId,userType,volunteerNumber,userFeedbackScore ' +
                    'from user ' +
                    'where (userId = (select helperId from volunteeritem where volunteerId = ?)) OR (userId = (select helpeeId from volunteeritem where volunteerId = ?))';
                params = [req.body.volunteerId,req.body.volunteerId];
                connection.query(stmt,params, function (err, result) {
                    if (err) throw err;
                    console.log(result);

                    var helperScoreAve = result[0].userFeedbackScore;
                    var helperNum = result[0].volunteerNumber;
                    var helperId = result[0].userId;

                    var helpeeScoreAve = result[1].userFeedbackScore;
                    var helpeeNum = result[1].volunteerNumber;
                    var helpeeId = result[1].userId;

                    stmt = 'select helpeeScore,helperScore from volunteeritem where volunteerId = ?';
                    connection.query(stmt,req.body.volunteerId, function (err, result) {
                        //connection.release();
                        if (err) throw err;
                        console.log(result);
                        var helpeeScore = result[0].helpeeScore;
                        var helperScore = result[0].helperScore;

                        var helperNumUpdate = helperNum-1;
                        if(helperNumUpdate < 0){
                            helperNumUpdate = 0;
                        }
                        var helperScoreAveUpdate;
                        if(helperNumUpdate == 0 )helperScoreAveUpdate = 0;
                        else{
                            helperScoreAveUpdate = (helperScoreAve* helperNum - helpeeScore)/helperNumUpdate;
                        }

                        var helpeeNumUpdate = helpeeNum-1;
                        if(helpeeNumUpdate < 0){
                            helpeeNumUpdate = 0;
                        }
                        var helpeeScoreAveUpdate;
                        if(helpeeNumUpdate == 0 )helpeeScoreAveUpdate = 0;
                        else{
                            helpeeScoreAveUpdate = (helpeeScoreAve* helpeeNum - helperScore)/helpeeNumUpdate;
                        }

                        stmt = 'update user set userFeedbackScore = ?, volunteerNumber = ? where userId = ?';
                        params = [helperScoreAveUpdate,helperNumUpdate,helperId];
                        connection.query(stmt,params, function (err, result) {
                            if (err) throw err;
                            stmt = 'update user set userFeedbackScore = ?, volunteerNumber = ? where userId = ?';
                            params = [helpeeScoreAveUpdate,helpeeNumUpdate,helpeeId];
                            connection.query(stmt,params, function (err, result) {
                                connection.release();
                                if (err) throw err;
                                res.send(JSON.stringify(result));
                            });
                        });
                    });
                });
            });
        });
    });
});


//봉사id -> helpee의 location & 시간
router.get('/helpee/location/:volunteerId', function (req, res) {
    var stmt = 'select helpeeLongitude as lng,helpeeLatitude as lat,date from location where volunteerId = ? AND helpeeLongitude is NOT NULL';
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
//봉사id -> helper의 location & 시간
router.get('/helper/location/:volunteerId', function (req, res) {
    var stmt = 'select helperLongitude as lng,helperLatitude as lat,date from location where volunteerId = ? AND helperLongitude is NOT NULL';
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

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
router.post('/login', passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}), // 인증 실패 시 401 리턴, {} -> 인증 스트레티지
    function (req, res) {
        res.redirect('/admin/usermanage');
    });

passport.use(new LocalStrategy({
    usernameField: 'userId',
    passwordField: 'adminPwd',
    passReqToCallback: true //인증을 수행하는 인증 함수로 HTTP request를 그대로  전달할지 여부를 결정한다
}, function (req, userId, adminPwd, done) {
    var stmt = 'select * from user where userId = ? AND adminPwd = ?';
    var params = [userId,adminPwd];
    connectionPool.getConnection(function (err, connection) {
        // Use the connection
        connection.query(stmt,params,function (err, result) {
            // And done with the connection.
            connection.release();
            if (err) throw err;
            if(result.length === 0){
                //res.send("fail");
                return done(false, null)
            }
            else{
                //res.send("success");
                return done(null, {
                    'user_id': userId
                });
            }
        });
    });
}));

passport.serializeUser(function (user, done) {
    done(null, user)
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

router.put('/one-line-feedback', function (req, res) {
    var stmt = 'update volunteeritem set helpeeFeedbackContent=? where volunteerId=?';
    var params = [req.body.helpeeFeedbackContent, req.body.volunteerId];
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
