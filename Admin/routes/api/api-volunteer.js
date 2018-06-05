var express = require('express');
var router = express.Router();
var volunteerRepository = require('../../repository/volunteer/VolunteerItemRepository')();

router.get('/:helpeeId/active-one', function (request, response) {
    var helpeeId = request.body.helpeeId;
    volunteerRepository.selecteOneByActive(helpeeId , function (result) {
        response.send(JSON.stringify(result));

    })
});

module.exports = router;
