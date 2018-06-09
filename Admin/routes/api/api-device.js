var express = require('express');
var router = express.Router();
var deviceRepository = require('../../repository/device/DeviceRepository')();

router.post('/', function (request, response) {

    var requestBody = request.body;

    var deviceId = requestBody.deviceId;
    var token = requestBody.token;
    var phoneNumber = requestBody.phoneNumber;

    deviceRepository.selectOne(deviceId, function (result) {
        if (result.length == 0) {
            deviceRepository.save(deviceId, token,phoneNumber, function () {
                response.end();
            });
        } else {
            deviceRepository.updateToken(deviceId, token, function () {
                response.end();
            })
        }
    })
});

module.exports = router;
