var express = require('express');
var router = express.Router();
var accessRepository = require('../repository/access/AccessRepository')();
router.get('/' , function (req , res) {
    accessRepository.save('/' , function () {
        res.render('intro/index.html');
    })

})



module.exports = router;
