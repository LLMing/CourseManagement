var express = require('express');
var router = express.Router();

var teacher = require('../database/teacher/teacher');
/* GET users listing. */
router.get('/', function(req, res, next) {
   teacher.queryAllAplan(req,res,next);
});

router.post('/',function(req,res,next){
	teacher.setTeachPlan(req,res,next);
});
router.get('/viewPlan',function(req,res,next){
	teacher.viewTeachPlan(req,res,next);
});
module.exports = router;
