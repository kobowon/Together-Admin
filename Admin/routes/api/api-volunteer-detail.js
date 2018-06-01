var express = require('express');
var query = require('../../db/db_wrap')();
var moment = require('moment');
var router = express.Router();
var accessRepository = require('../../repository/access/AccessRepository')();
var volunteerItemRepository = require('../../repository/volunteer/VolunteerItemRepository')();
var userRepository = require('../../repository/user/UserRepository')();

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/admin/login');
};

router.get('/volunteer-detail/:volId' ,isAuthenticated, function (req , res) {
    var queryString ='SELECT * FROM volunteeritem where volunteerId = ?';
    console.log(queryString);
    query.executeWithData(queryString,req.params.volId,function (volInfo) {
        res.render('admin/volunteer-detail.ejs',{volInfo : volInfo, moment : moment});
    });
});










module.exports = router;