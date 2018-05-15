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
//회원가입 중 사진등록
router.post('/addUser',upload.single('userfile'), function(req, res){// userfile이 form data의 key 가 된다.
    var img_path = req.file.filename;
    var uploadFile = {
        id: req.body.id,
        user_phone: req.body.user_phone,
        img: img_path
    }
    connection.query('INSERT INTO img SET ?', uploadFile, function(err,result){
        if(err) throw  err;
        else{
            res.send('Uploaded! : '+req.file); // object를 리턴함
            console.log('DB에 파일 삽입 완료(OkPacket)',result);
        }
    });
    console.log('uploads 폴더에 삽입한 파일',req.file); // 콘솔(터미널)을 통해서 req.file Object 내용 확인 가능.
});

//회원 사진 가져오기
router.get('/getImage/:user_phone', function(req, res){
    connection.query('SELECT * FROM img where user_phone= ?',req.params.user_phone, function(err,result){
        var ip = '192.168.0.47';
        if(err) throw  err;
        else{
            res.send('http://'+ip+':9001/image/'+result[0].img);
        }
    });
});

//자원봉사요청
router.post('/requestVolunteer',function(req,res){
    var body = req.body;
    var VolunteerItem = {
        type: body.type,
        helpee_ID: body.helpee_ID,
        helper_ID: body.helper_ID,
        longitude: body.longitude,
        latitude:  body.latitude,
        matchingStatus : body.matchingStatus,
        startStatus : body.startStatus,
        content : body.content,
        hour : body.hour,
        minute : body.minute,
        duration : body.duration,
        year : body.year,
        month : body.month,
        day : body.day,
        helpee_score:body.helpee_score,
        helper_score:body.helper_score
    }
    connection.query('INSERT INTO volunteerItem SET ?',VolunteerItem,function (err,result) {
        if(err) { throw err;}
        res.send("Helpee request is inserted");
    })
})


module.exports = router;