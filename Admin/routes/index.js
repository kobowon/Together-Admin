var express = require('express');
var router = express.Router();


router.get('/usermanage', function(req,res){
    res.render('usermanage.html');
})

router.get('/approve', function(req,res){
    res.render('approve.html');
})

module.exports = router;
