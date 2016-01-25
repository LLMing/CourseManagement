var express = require('express');
var router = express.Router();

var charge = require('../database/charge/charge');

router.get('/', function(req, res, next) {
  charge.queryTeachPlan(req,res,next);
});

router.post('/',function(req,res,next){
	charge.agreeTeachPlan(req,res,next);
});
router.post('/disagree',function(req,res,next){
	charge.updatedisCagree(req,res,next);
});
module.exports = router;