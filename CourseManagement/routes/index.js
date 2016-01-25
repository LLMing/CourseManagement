var express = require('express');
var router = express.Router();

var login = require('../database/login/login');
var aplan = require('../database/AteachPlan/aplan');
/* GET home page. */
// router.get('/', function (req, res, next) {
//   res.render('index', { 
//   	user: req.session.user,
//     success: req.flash('success').toString(),
//     error: req.flash('error').toString()
//   });
// });
router.post('/',function(req,res,next){
	login.compentPassword(req,res,next);
});
router.post('/Release',function(req,res,next){
	aplan.updateAteachPlan(req,res,next);
});

router.get('/',function(req,res,next){
	aplan.viewFinallyPlan(req,res,next);
});

module.exports = router;
