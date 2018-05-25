var express = require('express');
var router = express.Router();


router.get('/usermanage', function(req,res){
    res.render('usermanage.html');
})

router.get('/approve', function(req,res){
    res.render('approve.html');
})

router.get('/', function(req,res){
    res.render('index.html');
})

router.get('/page-contact' , function (req , res) {
    res.render('page-contact.html');
})

module.exports = router;
