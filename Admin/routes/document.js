var express = require('express');
var router = express.Router();
router.get('/', function(req,res){
    res.render('document/index.html');
})

router.get('/api-document', function(req,res){
    res.render('document/api-document.html');
})

module.exports = router;
