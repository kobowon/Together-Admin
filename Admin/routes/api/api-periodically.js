var express = require('express');
var router = express.Router();
var request = require('request');
var deviceRepository = require('../../repository/device/DeviceRepository')();
var volunteerItemRepository = require('../../repository/volunteer/VolunteerItemRepository')();

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

router.get('/start-alarm',function (request,response) {
    volunteerItemRepository.selectAlarmVolunteer(function (userId) {
        console.log(userId);
        var helperId,helpeeId,volunteerId;
        var helperToken,helpeeToken;
        for(var i=0; i<userId.length; i++){
            helperId = userId[i].helperId;
            helpeeId = userId[i].helpeeId;
            volunteerId = userId[i].volunteerId;
            deviceRepository.selectAlarmDevice(helpeeId,helperId,function (result) {
                helperToken = result[0].token;
                helpeeToken = result[1].token;
                console.log('id : ',helpeeId,'token : ',helpeeToken);
                console.log('id : ',helperId,'token : ',helperToken);
                volunteerItemRepository.getAlarm(volunteerId,function (result) {
                    console.log('result is',result);
                    console.log('alarm is',result[0].alarm);
                    if(result[0].alarm === 'YES'){
                        //nothing
                    }
                    else if(result[0].alarm === 'NO'){
                        sendMessageToUser(helperToken,{ message: '자원봉사 한 시간 전입니다'});
                        sendMessageToUser(helpeeToken,{ message: '자원봉사 한 시간 전입니다'});
                        volunteerItemRepository.setAlarm(volunteerId,function () {
                        })
                    }
                })
            })
        }
        response.end();
    })
})


module.exports = router;