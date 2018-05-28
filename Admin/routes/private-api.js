var express = require('express');
var router = express.Router();
router.get('/', function(req,res){
    res.render('private-api/index.html');
})

router.get('/document', function(req,res){
    res.render('private-api/document/api-document.html');
})

module.exports = router;
