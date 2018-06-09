var express = require('express');
var router = express.Router();
var moment = require('moment');
var mysql_dbc = require('../db/db_con')();
var connectionPool = mysql_dbc.createPool();
var accessRepository = require('../repository/access/AccessRepository')();
var query = require('../db/db_wrap')();

router.get('/', function (request, response) {

    accessRepository.save('/about-us' , function () {
        var queryStatement =
            'SELECT v.helpeeFeedbackContent, u.profileImage, u.name, u.gender, v.endAt ' +
            'FROM volunteeritem AS v ' +
            'JOIN user AS u ON v.helpeeId = u.userId ' +
            'AND helpeeFeedbackContent IS NOT NULL order by endAt desc limit 5';

        query.execute(queryStatement , function (result) {
            response.render('about-us/index.ejs' , {feedbackList : result , moment : moment});
        });
    });

});

module.exports = router;
