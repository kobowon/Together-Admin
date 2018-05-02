var express = require('express');
var router = express.Router();
var mysql_dbc = require('../db/db_con')();
var fs = require('fs');
var path = require('path');
var multer = require('multer');

var connection = mysql_dbc.init();
mysql_dbc.test_open(connection);

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
    }
})
var upload = multer({ storage: storage });

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../public/upload.html'))
});

router.post('/',upload.single('userfile'), function(req, res){
    res.send('Uploaded! : '+req.file); // object를 리턴함
    //별개
    var file_name = req.file.originalname;
    var img = fs.readFileSync(req.file.path);
    var uploadFile = {
        img: img,
        file_name: file_name
    }
    connection.query('INSERT INTO test_image SET ?', uploadFile, function(err,result){
        console.log('DB에 파일 삽입 완료(OkPacket)',result);
    });

    console.log('uploads 폴더에 삽입한 파일',req.file); // 콘솔(터미널)을 통해서 req.file Object 내용 확인 가능.
});


module.exports = router;
