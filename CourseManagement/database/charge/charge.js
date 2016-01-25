var mysql = require('mysql');
var $conf = require('../../conf/db.js');
var $util = require('../../util/util');
var $sql = require('./chargesql');


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
	queryTeachPlan:function(req,res,next){
		pool.getConnection(function(err,connection){
			connection.query($sql.queryteachPlan,function(err,result){
				console.log(result[0].note);
				if(result){
					req.flash('success','打开成功');
					res.render('charge',{
						title:'学院课程安排——教研室界面',
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
	agreeTeachPlan:function(req,res,next){
		pool.getConnection(function(err,connection){
			var body = req.body;
			console.log(body);
			connection.query($sql.updateAgree,[body.tid,body.course_id],function(err,result){
				if(result.affectedRows > 0){
					req.flash('success','同意并提交成功!');
					return res.redirect('/charge');
				}else{
					req.flash('error','提交失败');
					return res.redirect('/charge');
				}
			});
			connection.release();
		});
	},
	updatedisCagree:function(req,res,next){
		pool.getConnection(function(err,connection){
			var body = req.body;
			console.log(body);
			connection.query($sql.updatedisCagree,[body.tid,body.course_id],function(err,result){
				if(result.affectedRows > 0){
					req.flash('success','操作成功!');
					return res.redirect('/charge');
				}else{
					req.flash('error','提交失败');
					return res.redirect('/charge');
				}
			});
			connection.release();
		});
	}
}