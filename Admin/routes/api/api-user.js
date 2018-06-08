var express = require('express');
var router = express.Router();
var userRepository = require('../../repository/user/UserRepository')();
var deviceRepository = require('../../repository/device/DeviceRepository')();

router.get('/helpee/:phoneNumber', function (request, response) {
    var phoneNumber = request.params.phoneNumber;
    userRepository.selectHelpee(phoneNumber , function (result) {
        response.send(JSON.stringify(result));
    })
});

router.post('/helpee/:deviceId', function (request, response) {

    deviceRepository.selectOne(request.params.deviceId , function (device) {
        var requestBody = request.body;

        var body = {
            phoneNumber : requestBody.phoneNumber,
            name : requestBody.name ,
            deviceId : device[0].id ,
            age : requestBody.age,
            imageName : requestBody.imageName,
            gender : requestBody.gender
        };
        userRepository.saveHelpee(body , function () {
            response.end();
        })
    })


});

module.exports = router;