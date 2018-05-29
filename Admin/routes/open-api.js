var express = require('express');
var router = express.Router();
var accessRepository = require('../repository/access/AccessRepository')();

router.get('/', function(req,res){
    accessRepository.save('/open-api' , function () {
        res.render('open-api/index.html');
    });

})

router.get('/document', function(req,res){
    res.render('open-api/document/api-document.html');
})

module.exports = router;
