var express = require('express');
var router = express.Router();
var volunteerRepository = require('../../repository/volunteer/VolunteerItemRepository')();
var userRepository = require('../../repository/user/UserRepository')();
var request = require('request');

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

router.get('/:helpeeId/active-one', function (request, response) {
    var helpeeId = request.params.helpeeId;
    volunteerRepository.selectOneByActive(helpeeId , function (result) {
        response.send(JSON.stringify(result));

    })
});



router.put('/:volunteerId/accept', function (req, res) {
    var volunteerId = req.params.volunteerId;
    volunteerRepository.updateMatched(volunteerId , function () {
        volunteerRepository.selectOne(volunteerId , function (volunteer) {
            userRepository.selectUserDeviceToken(volunteer.helperId , function (result) {
                var token = result;
                console.log(token);
                sendMessageToUser(token,{ message: '매칭 완료'});
                res.end();
            });
        })
    });
});

router.delete('/:id', function (request, response) {
    var id = request.params.id;
    volunteerRepository.delete(id , function () {
        response.end();

    })
});

router.post('/' , function (request , response) {
    var requestBody = request.body;

    var data = {
        helpeeId : requestBody.userId,
        startAt : requestBody.startAt ,
        endAt : requestBody.endAt ,
        latitude : requestBody.latitude,
        longitude : requestBody.longitude,
        message : requestBody.message
    };

    volunteerRepository.saveHelp(data , function (result) {
        response.send(JSON.stringify({volunteerId : result.insertId}));
    });
});

router.get('/{volunteerId}/recommend/helper' , function (request , response) {
    //TODO 정소영 , 고보원 구현할것
    //volunteerId  의 조건을 보고 적절할  helper 가 있다면 1명을 리턴할것.
    // 없다면 null 리턴.
    response.send(JSON.stringify(null));
});

module.exports = router;
