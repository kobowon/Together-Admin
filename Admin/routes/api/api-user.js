var express = require('express');
var router = express.Router();
var userRepository = require('../repository/user/UserRepository')();

router.get('/:deviceId', function (request, response) {
    var deviceId = request.params.deviceId;
    userRepository.selectUser(deviceId , function (result) {
        response.send(JSON.stringify(result));
    })
});

module.exports = router;