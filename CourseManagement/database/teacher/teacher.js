var mysql = require('mysql');
var $conf = require('../../conf/db.js');
var $util = require('../../util/util');
var $sql = require('./teachersql');


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
	queryAllAplan:function(req,res,next){
		pool.getConnection(function(err,connection){
			connection.query($sql.queryAllPlan,function(err,result){
				console.log(result);
				if(result != 0){
					req.flash('success', '打开成功');
					res.render('teacher',{ 
						title:'学院课程安排——教师界面',
						result:result,
						user: req.session.user,
					    success: req.flash('success').toString(),
					    error: req.flash('error').toString()
					});
				}else{
					req.flash('error', '没有发布过教学计划或数据库出错');
					res.render('teacher',{ 
						title:'学院课程安排——教师界面',
						result:result,
						user: req.session.user,
					    success: req.flash('success').toString(),
					    error: req.flash('error').toString()
					});
				}
			});
			connection.release();
		});
	},
	setTeachPlan:function(req,res,next){
		pool.getConnection(function(err,connection){
			var body = req.body;
			console.log(body.tid);
			if(body.tid == 0 || body.course_id == 0 || body.wtime == 0 || body.note == 0){
				req.flash('error','教学计划所有项均不能为空');
				return res.redirect('/teacher');
			}
			
			connection.query($sql.queryCourse,body.course_id,function(err,result){
				if(result != 0){
					connection.query($sql.queryPlanCount,body.tid,function(err,result){
						if(result != 0){
							if(result[0].course_idf == null){
								connection.query($sql.updateCourse_idf,[body.course_id,+body.tid],function(err,result){
									if(result.affectedRows > 0){
										connection.query($sql.insertSettplan,[body.tid,body.course_id,body.wtime,body.note],function(err,result){
											if(result){
												req.flash('success','提交成功!');
												return res.redirect('/teacher');
											}else{
												req.flash('error','在添加到数据库时出错，请重新提交');
												return res.redirect('/teacher');
											}
										});
									}else{
										req.flash('error','在更新教学计划数量时出错，请重新提交');
										res.redirect('/teacher');
									}
								});
							}else if(result[0].course_ids == null){
								connection.query($sql.updateCourse_ids,[body.course_id,+body.tid],function(err,result){
									if(result.affectedRows > 0){
										connection.query($sql.insertSettplan,[body.tid,body.course_id,body.wtime,body.note],function(err,result){
											if(result){
												req.flash('success','提交成功!');
												return res.redirect('/teacher');
											}else{
												req.flash('error','在添加到数据库时出错，请重新提交');
												return res.redirect('/teacher');
											}
										});
									}else{
										req.flash('error','在更新教学计划数量时出错，请重新提交');
										return res.redirect('/teacher');
									}
								});
				}else{
					req.flash('error','教学计划数量不能超过两门！');
					return res.redirect('/teacher');
				}
						}else{
							req.flash('error','教师编号不正确');
							return res.redirect('/teacher');
						}
					});
				}else{
					req.flash('error','课程编号不正确');
					return res.redirect('/teacher');
				}
			});
			connection.release();
		});
	},
	viewTeachPlan:function(req,res,next){
		pool.getConnection(function(err,connection){
			connection.query($sql.queryViewPlan,function(err,result){
				if(result){
					req.flash('success', '打开成功');
					res.render('tviewplan',{ 
						title:'学院课程安排——教师查看教学计划页面',
						result:result,
					    success: req.flash('success').toString(),
					    error: req.flash('error').toString()
					});
				}
			});
			connection.release();
		});
	}
};