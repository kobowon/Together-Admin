var express = require('express');
var router = express.Router();


router.get('/usermanage', function(req,res){
    res.render('usermanage.html');
})

router.get('/approve', function(req,res){
    res.render('approve.html');
})

router.get('/login' , function (req , res) {
    res.render('login.html');
})

router.get('/', function(req,res){
    res.render('intro/index.html');
})

router.get('/contact-us' , function (req , res) {
    res.render('contact-us/index.html');
})

router.get('/join-us' , function (req , res) {
    res.render('join-us/index.html');
})

router.get('/map' , function (req , res) {
    res.render('map.html');
})

////소영 츄가

/////////////

module.exports = router;
