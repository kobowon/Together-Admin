var express = require('express');
var router = express.Router();
var volunteerRepository = require('../../repository/volunteer/VolunteerItemRepository')();

router.get('/:helpeeId/active-one', function (request, response) {
    var helpeeId = request.params.helpeeId;
    volunteerRepository.selectOneByActive(helpeeId , function (result) {
        response.send(JSON.stringify(result));

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
