var express = require('express');
var router = express.Router();

var aplan = require('../database/AteachPlan/aplan');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('academic', { 
  	title: '学院课程安排——教务处界面',
  	user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString() 
  });
});

router.get('/teachPlan',function(req,res,next){
	res.render('AteachPlan',{ 
		title: '学院课程安排——教务处发布教学计划界面',
        user: req.session.user,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
	});
});
router.post('/teachPlan',function(req,res,next){
	aplan.insertaplan(req,res,next);
});

router.get('/viewPlan',function(req,res,next){
	aplan.queryAllPlan(req,res,next);
});

router.get('/viewTeachPlan',function(req,res,next){
  aplan.viewTeachPlan(req,res,next);
});

router.post('/viewTeachPlan',function(req,res,next){
  aplan.agreeTeachPlan(req,res,next);
});

router.post('/disagree',function(req,res,next){
  aplan.updatedisAagree(req,res,next);
});

module.exports = router;