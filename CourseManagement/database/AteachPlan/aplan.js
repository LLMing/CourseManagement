var mysql = require('mysql');
var $conf = require('../../conf/db.js');
var $util = require('../../util/util');
var $sql = require('./aplansql');


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

//将表单数据插入数据表AteachPlan
module.exports = {
	insertaplan:function(req,res,next){
		pool.getConnection(function(err,connection){
			var body = req.body;
			if(body.course_name == 0 || body.course_id == 0 || body.course_time == 0 || body.category == 0 || body.class_id == 0){
				req.flash('error', '所有项均不能为空');
				return res.redirect('/academic/teachPlan');
			}
			console.log(body);
			connection.query($sql.insertAteachPlan,[body.course_name,body.course_id,body.course_time,body.category,body.class_id],function(err,result){
				if (result) {
					req.flash('success', '发布成功，可以选择继续发布或返回教务处主界面');
					return res.redirect('/academic/teachPlan');
				}else{
					req.flash('error', '数据库出错，请重新发布');
					return res.redirect('/academic/teachPlan');
				}
			});
			connection.release();
		});
	},
	queryAllPlan:function(req,res,next){
		pool.getConnection(function(err,connection){
			connection.query($sql.queryAllPlan,function(err,result){
				console.log(result);
				if(result != 0){
					req.flash('success', '打开成功');
					res.render('viewPlan',{ 
						title:'学院课程安排——教务处查看曾发布教学计划界面',
						result:result,
						user: req.session.user,
					    success: req.flash('success').toString(),
					    error: req.flash('error').toString()
					});
				}else{
					req.flash('error', '没有发布过教学计划或数据库出错');
					res.redirect('academic');
				}
			});
			connection.release();
		});
	},
	setPlanLimit:function(req,res,next){
		pool.getConnection(function(err,connection){
			connection.query($sql.queryAllPlan,function(err,result){
				console.log(result);
				if(result != 0){
					req.flash('success', '打开成功');
					res.render('setPlanLimit',{ 
						title:'学院课程安排——教研室设置教学限制界面',
						result:result,
						user: req.session.user,
					    success: req.flash('success').toString(),
					    error: req.flash('error').toString()
					});
				}else{
					req.flash('error', '没有发布过教学计划或数据库出错');
					res.redirect('research');
				}
			});
			connection.release();
		});
	},
	updatePlan:function(req,res,next){
		pool.getConnection(function(err,connection){
			var body = req.body;
			console.log(body);
			connection.query($sql.updatePlan,[body.job_title,body.class_number,body.max_wtime,body.min_wtime,body.course_id],function(err,result){
				console.log(result);
				if(result){
					if(result.affectedRows > 0){
						req.flash("success",'提交成功!');
						return res.redirect('/research/setPlanLimit');
					}else{
						req.flash('error','提交出错或没有修改数据，请重新提交');
						return res.redirect('/research/setPlanLimit');
					}
				}else{
					req.flash('error', '数据库出错，请重新提交');
					return res.redirect('/research/setPlanLimit');
				}
			})
			connection.release();
		});
	},
	updateAteachPlan:function(req,res,next){
		pool.getConnection(function(err,connection){
			var body = req.body;
			console.log(body);
			// connection.query($sql.queryTeachPlan,body.course_id,function(err,result){
			// 	if(result != 0){
			// 		connection.query($sql.updateTeachPlan,[body.job_title,body.class_number,body.max_wtime,body.min_wtime,+body.course_id],function(err,result){
			// 			console.log(result);
			// 			if(result.affectedRows > 0){
			// 				req.flash("success","发布成功！");
			// 				return res.redirect('/research/setPlanLimit');
			// 			}else{
			// 				req.flash('error', '数据库出错，请重新提交');
			// 				return res.redirect('/research/setPlanLimit');
			// 			}
			// 		});
			// 	}else{
			// 		connection.query($sql.insertTeachPlan,[body.course_name,body.course_id,body.course_time,body.category,body.class_id,body.job_title,body.class_number,body.max_wtime,body.min_wtime],function(err,result){
			// 			if(result){
			// 				req.flash("success","发布成功！");
			// 				return res.redirect('/research/setPlanLimit');
			// 			}else{
			// 				req.flash('error', '数据库出错，请重新提交');
			// 				return res.redirect('/research/setPlanLimit');
			// 			}
			// 		});
			// 	}
			// });
			//2016/1/17
			connection.query($sql.updateAteachPlan,body.course_id,function(err,result){
				console.log(result);
				if(result){
				if(result.affectedRows > 0){
					req.flash("success","发布成功！");
					return res.redirect('/research/setPlanLimit');
				}else{
					req.flash('error', '数据库出错，请重新提交');
					return res.redirect('/research/setPlanLimit');
				}
			}else{
				req.flash('error','发布失败，请检查数据类型后发布');
				return res.redirect('/research/setPlanLimit');
			}
			});
			connection.release();
		});
	},
	viewTeachPlan:function(req,res,next){
		pool.getConnection(function(err,connection){
			connection.query($sql.querySettPlan,function(err,result){
				if(result){
					req.flash('success','打开成功');
					res.render('acViewPlan',{
						title:'学院课程安排——查看教务人员审核通过的教学计划页面',
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
			connection.query($sql.updateAagree,[body.tid,body.course_id],function(err,result){
				if(result.affectedRows > 0){
					req.flash('success','同意并提交成功!');
					return res.redirect('/academic/viewTeachPlan');
				}else{
					req.flash('error','提交失败');
					return res.redirect('/academic/viewTeachPlan');
				}
			});
			connection.release();
		});
	},
	viewFinallyPlan:function(req,res,next){
		pool.getConnection(function(err,connection){
			connection.query($sql.queryByAagree,function(err,result){
				if(result){
					res.render('index',{
  						user: req.session.user,
    					success: req.flash('success').toString(),
    					error: req.flash('error').toString(),
						result: result
					});
				}else{
					res.json({
						state:'0',
						msg:'没有教学任务书'
					});
				}
			});
			connection.release();
		});
	},
	updatedisAagree:function(req,res,next){
		pool.getConnection(function(err,connection){
			var body = req.body;
			connection.query($sql.updatedisAagree,[body.tid,body.course_id],function(err,result){
				if(result.affectedRows > 0){
					req.flash('success','操作成功');
					return res.redirect('/academic/viewTeachPlan');
				}else{
					req.flash('error','提交失败');
					return res.redirect('/academic/viewTeachPlan');
				}
			});
			connection.release();
		});
	}
};