var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};

router.get('/usermanage',isAuthenticated, function(req,res){
    res.render('usermanage.html');
})

router.get('/approve',isAuthenticated, function(req,res){
    res.render('approve.html');
})

router.get('/login' , function (req , res) {
    res.render('login.html');
})

router.get('/', function(req,res){
    res.render('intro/index.html');
})


router.get('/join-us' , function (req , res) {
    res.render('join-us/index.html');
})

router.get('/map' , function (req , res) {
    res.render('map.html');
})

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
});

module.exports = router;
