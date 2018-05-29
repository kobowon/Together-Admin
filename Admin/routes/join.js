var express = require('express');
var router = express.Router();
var accessRepository = require('../repository/access/AccessRepository')();
router.get('/' , function (req , res) {
    accessRepository.save('/join-us' , function () {
        res.render('join-us/index.html');
    })

})



module.exports = router;
