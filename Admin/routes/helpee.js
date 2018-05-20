var express = require('express');
var router = express.Router();
var mysql_dbc = require('../db/db_con')();
var connection = mysql_dbc.init();
var path = require('path');
var multer = require('multer');
mysql_dbc.test_open(connection);

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename : function (req, file, callback) {
        callback(null, Date.now() + '.' + 'jpeg' ); // 업로드할 파일의 이름을 원하는 것으로 바꿀 수 있다. ( 원본 파일명은 프로퍼티로 따로 갖고 있음.)
    }
    //file.mimetype.split('/')[1]
})

var upload = multer({ storage: storage });

//회원가입
/*router.post('/add-user',upload.single('userfile'), function(req, res){// userfile이 form data의 key 가 된다.
    var img_path = req.file.filename;
    var user = {
        userId: req.body.userPhone,
        userPhone: req.body.userPhone,
        userType: 'helpee',
        profileImage: img_path
    }
    connection.query('INSERT INTO user SET ?', user, function(err,result){
        if(err) throw  err;
        else{
            res.send('Uploaded! : '+req.file); // object를 리턴함
            console.log('DB에 파일 삽입 완료(OkPacket)',result);
        }
    });
    console.log('uploads 폴더에 삽입한 파일',req.file); // 콘솔(터미널)을 통해서 req.file Object 내용 확인 가능.
});*/
//회원가입
router.post('/signup',upload.single('userfile'), function(req, res){// userfile이 form data의 key 가 된다.
    var img_path = req.file.filename;
    var user = {
        userId: req.body.userPhone,
        userPhone: req.body.userPhone,
        userType: 'helpee',
        profileImage: img_path
    }
    connection.query('INSERT INTO user SET ?', user, function(err,result){
        if(err) throw  err;
        else{
            res.send('Uploaded! : '+req.file); // object를 리턴함
            console.log('DB에 파일 삽입 완료(OkPacket)',result);
        }
    });
    console.log('uploads 폴더에 삽입한 파일',req.file); // 콘솔(터미널)을 통해서 req.file Object 내용 확인 가능.
});


//회원 사진 변경
/*router.put('/update-photo',upload.single('userfile'), function(req, res){// userfile이 form data의 key 가 된다.
    var img_path = req.file.filename;
    var stmt = 'UPDATE user SET profileImage = ? where userPhone = ?';
    var params = [img_path,req.body.userPhone];
    connection.query(stmt, params, function(err,result){
        if(err) throw  err;
        else{
            res.send('Update : '+req.file); // object를 리턴함
            console.log('유저 사진 수정 완료');
        }
    });
    console.log('uploads 폴더에 수정한 파일',req.file);
});*/
//회원 사진 변경
router.put('/photo',upload.single('userfile'), function(req, res){// userfile이 form data의 key 가 된다.
    var img_path = req.file.filename;
    var stmt = 'UPDATE user SET profileImage = ? where userPhone = ?';
    var params = [img_path,req.body.userPhone];
    connection.query(stmt, params, function(err,result){
        if(err) throw  err;
        else{
            res.send('Update : '+req.file); // object를 리턴함
            console.log('유저 사진 수정 완료');
        }
    });
    console.log('uploads 폴더에 수정한 파일',req.file);
});

//회원 사진 가져오기
/*router.get('/get-image/:userPhone', function(req, res){
    connection.query('SELECT * FROM user where userPhone= ?',req.params.userPhone, function(err,result){
        var ip = '192.168.20.65';
        if(err) throw  err;
        else{
            res.send('http://'+ip+':9001/image/'+result[0].profileImage);
        }
    });
});*/
//회원 사진 가져오기
router.get('/photo/:userPhone', function(req, res){
    connection.query('SELECT * FROM user where userPhone= ?',req.params.userPhone, function(err,result){
        if(err) throw  err;
        else{
            res.send('http://210.89.191.125/photo/'+result[0].profileImage);
        }
    });
});

//존재하는 유저인지 확인
/*router.get('/check-user/:userPhone', function(req, res){
    connection.query('SELECT * FROM img where userPhone= ?',req.params.userPhone, function(err,result){
        if(err) throw  err;
        else{
            if(result.length == 0){
                res.send('false');
            }
            else{
                res.send('true');
            }
        }
    });
});*/
//존재하는 유저인지 확인
router.get('/user/:userPhone', function(req, res){
    connection.query('SELECT * FROM user where userPhone= ?',req.params.userPhone, function(err,result){
        if(err) throw  err;
        else{
            if(result.length == 0){
                res.send('false');
            }
            else{
                res.send('true');
            }
        }
    });
});


//봉사날짜(date), 시간(time), 봉사종류(type), 봉사기간(duration), 위도(latitude), 경도(longitude), 핸드폰 번호(userPhone), 기타(content)

//자원봉사요청
/*router.post('/request-volunteer',function(req,res){
    var body = req.body;
    var VolunteerItem = {
        type: body.type,//outdoor
        helper_ID: "",//abc
        helpee_ID: body.userPhone,//01087654321
        longitude: body.longitude,//127.038607
        latitude:  body.latitude,//37.276905
        content : body.content,
        date : body.date,//2018-05-15
        time : body.time,//18:30:00
        duration : body.duration,//3
        matchingStatus : 0,
        startStatus : 0
    };
    connection.query('INSERT INTO volunteerItem SET ?',VolunteerItem,function (err,result) {
        if(err) { throw err;}
        res.send("Helpee request is inserted");
    })
})*/
//자원봉사요청
router.post('/volunteer',function(req,res){
    var body = req.body;
    var VolunteerItem = {
        type: body.type,//outdoor
        helperId: "",//abc
        helpeeId: body.userPhone,//01087654321
        longitude: body.longitude,//127.038607
        latitude:  body.latitude,//37.276905
        content : body.content,
        date : body.date,//2018-05-15
        time : body.time,//18:30:00
        duration : body.duration,//3
        matchingStatus : 0,
        startStatus : 0
    };
    connection.query('INSERT INTO volunteeritem SET ?',VolunteerItem,function (err,result) {
        if(err) { throw err;}
        res.send("Helpee request is inserted");
    })
})

module.exports = router;