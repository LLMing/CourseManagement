var mysql = require('mysql');
var $conf = require('../../conf/db.js');
var $util = require('../../util/util');
var $sql = require('./researchsql');


//使用连接池，提升性能
var pool = mysql.createPool($util.extend({},$conf.mysql));

//向前台返回JSON方法的简单封装
var jsonWrite = function (res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            state:'0',
            msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
};

module.exports = {
	chargeReseachPlan:function(req,res,next){
		pool.getConnection(function(err,connection){
			connection.query($sql.querySettplan,function(err,result){
				if(result){
					req.flash('success','打开成功');
					res.render('chargeResearch',{
						title:'学院课程安排——查看教研室提交的教学计划页面',
						result:result,
						user: req.session.user,
					    success: req.flash('success').toString(),
					    error: req.flash('error').toString()
					});
				}else{
					res.json({
						state:'0',
						msg:'打开数据库出错'
					});
				}
			});
			connection.release();
		});
	},
	updateRagree:function(req,res,next){
		pool.getConnection(function(err,connection){
			var body = req.body;
			console.log(body);
			connection.query($sql.updateRagree,[body.tid,body.course_id],function(err,result){
				if(result.affectedRows > 0){
					req.flash('success','同意并提交成功!');
					return res.redirect('/research/PutPlan');
				}else{
					req.flash('error','提交失败');
					return res.redirect('/research/PutPlan');
				}
			});
			connection.release();
		});
	},
	updatedisRagree:function(req,res,next){
		pool.getConnection(function(err,connection){
			var body = req.body;
			connection.query($sql.updatedisRagree,[body.tid,body.course_id],function(err,result){
				if(result.affectedRows > 0){
					req.flash('success','操作成功');
					return res.redirect('/research/PutPlan');
				}else{
					req.flash('error','提交失败');
					return res.redirect('/research/PutPlan');
				}
			});
			connection.release();
		});
	}
}