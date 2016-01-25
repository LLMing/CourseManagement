var express = require('express');
var router = express.Router();

var SetPlanLimit = require('../database/AteachPlan/aplan');
var research = require('../database/research/research');

/* GET users listing. */
router.get('/', function(req, res, next) {
   res.render('research', { 
   	title: '学院课程安排——教务人员界面',
   	user: req.session.user,
   	success: req.flash('success').toString(),
	error: req.flash('error').toString()
   });
});

router.get('/SetPlanLimit',function(req,res,next){
	SetPlanLimit.setPlanLimit(req,res,next);
});

router.post('/SetPlanLimit',function(req,res,next){
	SetPlanLimit.updatePlan(req,res,next);
});

router.get('/PutPlan',function(req,res,next){
	research.chargeReseachPlan(req,res,next);
});

router.post('/PutPlan',function(req,res,next){
	research.updateRagree(req,res,next);
});

router.post('/disagree',function(req,res,next){
	research.updatedisRagree(req,res,next);
});
module.exports = router;