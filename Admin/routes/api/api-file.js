var express = require('express');

var router = express.Router();
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, callback) {

        callback(null, '/root/deploy/Admin/uploads/') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정
    },
    filename : function (req, file, callback) {

        callback(null, Date.now() + '.' + 'jpeg' ); // 업로드할 파일의 이름을 원하는 것으로 바꿀 수 있다. ( 원본 파일명은 프로퍼티로 따로 갖고 있음.)
    }
})
var upload = multer({ storage: storage });

router.post('/image', upload.single('image'), function (request, response) {
    var img_path = request.file.filename;
    console.log(img_path);
    response.send(JSON.stringify({fileName : img_path}));
});



module.exports = router;
