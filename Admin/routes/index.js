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
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
router.post('/login', passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}), // 인증 실패 시 401 리턴, {} -> 인증 스트레티지
    function (req, res) {
        res.redirect('/usermanage');
    });

passport.use(new LocalStrategy({
    usernameField: 'userId',
    passwordField: 'adminPwd',
    passReqToCallback: true //인증을 수행하는 인증 함수로 HTTP request를 그대로  전달할지 여부를 결정한다
}, function (req, userId, adminPwd, done) {
    if(userId === 'admin' && adminPwd === '12345'){
        return done(null, {
            'user_id': userId,
        });
    }else{
        return done(false, null)
    }
}));

passport.serializeUser(function (user, done) {
    done(null, user)
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};

router.get('/myinfo', isAuthenticated, function (req, res) {
    res.render('myinfo',{
        title: 'My Info',
        user_info: req.user
    })
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});
/////////////

module.exports = router;
