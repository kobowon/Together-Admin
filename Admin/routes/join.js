var express = require('express');
var router = express.Router();

router.get('/' , function (req , res) {
    res.render('join-us/index.html');
})

module.exports = router;
