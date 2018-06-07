var express = require('express');
var router = express.Router();
var userRepository = require('../../repository/user/UserRepository')();
var deviceRepository = require('../../repository/device/DeviceRepository')();

router.get('/helpee/:deviceId', function (request, response) {
    var deviceId = request.params.deviceId;
    userRepository.selectUser(deviceId , function (result) {
        response.send(JSON.stringify(result));
    })
});

router.post('/helpee/:deviceId', function (request, response) {

    deviceRepository.selectOne(request.params.deviceId , function (result) {
        var body = request.body;
        body.deviceId = result.id;
        userRepository.saveHelpee(body , function () {
            response.end();
        })
    })


});

module.exports = router;