var express = require('express');
var moment = require('moment');
var router = express.Router();
var volunteerRepository = require('../../repository/volunteer/VolunteerItemRepository')();
var userRepository = require('../../repository/user/UserRepository')();




router.get('/:id', function (request, response) {
    var id = request.params.id;

    var result = {};
    userRepository.selectHelpee(id, function (user) {

        result.user = user;
        volunteerRepository.selectOneByActive(id, function (volunteer) {
            result.volunteer = volunteer;
            response.render('mobile/home/user-index.ejs', {result: result, moment: moment});
        });
    });
});

router.get('/', function (request, response) {
    response.render('mobile/home/index.ejs');

});

router.get('/user/register/face', function (request, response) {
    response.render('mobile/user/register/register-face-form.ejs');
});

router.get('/user/register/age', function (request, response) {
    response.render('mobile/user/register/register-age-form.ejs');
});

router.get('/user/register/gender', function (request, response) {
    response.render('mobile/user/register/register-gender-form.ejs');
});

router.get('/user/register/name', function (request, response) {
    response.render('mobile/user/register/register-name-form.ejs');
});

router.get('/user/:userId/register/done', function (request, response) {
    var userId = request.params.userId;
    
    userRepository.selectHelpee(userId , function (user) {
        var result = {};
        result.user = user;
        response.render('mobile/user/register/register-done.ejs' , {result :result});
    });

});

router.get('/volunteer/register', function (request, response) {
    response.render('mobile/volunteer/register/register-form.ejs');
});


router.get('/user/volunteer/:volunteerId/register/done', function (request, response) {
    var id = request.params.volunteerId;

    var result = {};
    volunteerRepository.selectOne(id , function (volunteer) {
        result.volunteer = volunteer;

        userRepository.selectHelpee(volunteer.helpeeId , function (user) {
            result.user = user;
            response.render('mobile/volunteer/register/register-done.ejs' , {result : result , moment : moment});
        });
    })

});
module.exports = router;
