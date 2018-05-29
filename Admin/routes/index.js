var express = require('express');
var router = express.Router();



router.get('/', function(req,res){
    res.render('intro/index.html');
})



module.exports = router;
