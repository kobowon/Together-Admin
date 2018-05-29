var express = require('express');
var router = express.Router();
var accessRepository = require('../repository/access/AccessRepository')();
router.get('/' , function (req , res) {
    accessRepository.save('/contact-us' ,  function () {
        res.render('contact-us/index.html');
    });

})

module.exports = router;
