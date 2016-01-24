var mysql = require('mysql');
var $conf = require('../../conf/db');
var $util = require('../../util/util');
var $sql = require('./contentsql');
var async = require('async');

var pool = mysql.createPool($util.extend({},$conf.mysql));
var jsonWrite = function(res,ret){
	if(typeof ret ==='undefined'){
		res.json({
			state:'0',
			msg:'操作失败'
		});
	}else{
		res.json(ret);
	}
};

module.exports = {
	addDossier:function(req,res,next){
		pool.getConnection(function(err,connection){
			var body = req.body.data;
			var param =eval("(" + body + ")");
			console.log(param);

			if(param.modifier_id == null || param.medical_id == null || param.record_id == null){
				console.log('必填项不能为空');
				res.json({
					state:'0',
					msg:'必填项不能为空'
				});
				return;
			}
			connection.query($sql.queryRight,[param.modifier_id,param.medical_id],function(err,result){
				if(result != 0){
					if(result[0].user_right < 2){
						connection.query($sql.insert,[param.medical_id,param.modifier_id,param.record_type,param.record_content,param.hospital,param.doctor,param.diagnosis_time,param.record_id,param.note,param.modify_time],function(err,result){
							console.log(result);
							if(result){
								console.log('添加病例成功');
								res.json({
									state:'1',
									msg:'添加病例成功',
									captcha:'success'
								});
								return;
							}else{
								console.log('数据库出错');
								res.json({
									state:'0',
									msg:'数据库出错',
									captcha:'err'
								});
								return;
							}
						});
					}else{
						console.log('没有添加权限');
						res.json({
							state:'0',
							msg:'没有添加权限',
							captcha:'err'
						});
						return;
					}
				}else{
					console.log('没有添加权限下');
					res.json({
						state:'0',
						msg:'没有添加权限',
						captcha:'err'
					});
				}
			});
			connection.release();
		});
	},
	updateContent:function(req,res,next){
		pool.getConnection(function(err,connection){
			var body = req.body.data;
			var param= JSON.parse(body); 
			// console.log("body-------------------------------------------"+body);
			// console.log("param-------------------------------------------"+param);
			if(param.modifier_id == null || param.record_id == null || param.medical_id == null){
				console.log('必填项不能为空');
				res.json({
					state:'0',
					msg:'必填项不能为空'
				});
				return;
			}
			connection.query($sql.queryRight,[param.modifier_id,param.medical_id],function(err,result){
				if(result != 0){
					if(result[0].user_right <2 && result[0].forbidden == 0){
						var record_content = JSON.stringify(param.record_content);
						var sql = connection.query($sql.update,[param.hospital,param.diagnosis_time,param.modify_time,param.doctor,param.modifier_id,param.note,record_content,param.record_id],function(err,result){
							if(result != null){
								console.log(result.affectedRows);
								if(result.affectedRows > 0){
									console.log('修改成功');
									res.json({
										state:'1',
										msg:'修改成功'
									});
									return;
								}else{
									var record_content = JSON.stringify(param.record_content);
									connection.query($sql.insert,[param.medical_id,param.modifier_id,param.record_type,record_content,param.hospital,param.doctor,param.diagnosis_time,param.record_id,param.note,param.modify_time],function(err,result){
										console.log(param);
										console.log(result);
										if(result){
											console.log('添加病例成功');
											res.json({
												state:'1',
												msg:'添加病例成功',
												captcha:'success'
											});
											return;
										}else{
											console.log('数据库出错');
											res.json({
												state:'0',
												msg:'数据库出错',
												captcha:'err'
											});
											return;
										}
									});
								}
							}else{
								console.log("修改失败");
								// console.log(err);
								console.log(sql.sql);
								res.json({
								state:'0',
								msg:'没有此病例内容'
								});
								return;
							}
						});
					}else{
						console.log('没有修改权限');
						res.json({
							state:'0',
							msg:'没有修改权限'
						});
						return;
					}
				}else{
					console.log('参数错误');
					res.json({
						state:'0',
						msg:'参数错误'
					});
				}
			});

			connection.release();
		});
	},
	deleteContent:function(req,res,next){
		pool.getConnection(function(err,connection){
			var boby = req.body.data;
			var body = boby.replace(/\s+/g, "") ;
			var data= body.split(",");
			var len = data.length,
			    i = 0;
			console.log(data);
			console.log(data[0]);
			console.log(data[1]);
			var delecont = [];
			(function(i,len,count,callback){
				for (; i < len; i++) {
					connection.query($sql.deleteContent,data[i],function(err,result){
						var a = data[i];
						if(result.affectedRows > 0){
							delecont.push(a+"删除成功");
							if(++count === len){
								callback();
							}
						}else{
							delecont.push(a+"删除失败");
							if(++count === len){
								callback();
							}
						}
					});
				}
			}(0,data.length,0,function(){
				res.json({
					state:"1",
					msg:"全部删除成功"
				});
			}));
			connection.release();
		});
	},
	queryAllContent:function(req,res,next){
		pool.getConnection(function(err,connection){
			var param = req.query || req.params;
			if(param.user_id == null || param.medical_id == null){
				res.json({
					state:'0',
					msg:'必传参数不能为空'
				});
				return;
			}

			connection.query($sql.queryRight,[param.user_id,param.medical_id],function(err,result){
				console.log(result);
					if(result != 0){
						connection.query($sql.queryContent,param.medical_id,function(err,result){
								if(result){
									res.json({
										state:'1',
										msg:'获取病例内容成功',
										data:result
									});
									return;
								}else{
									res.json({
										state:'0',
										msg:'获取病例内容失败'
									});
									return;
								}
						});
					}else{
						res.json({
							state:'0',
							msg:'没有权限'
						});
					}
			});
			connection.release();
		});
	},
	pushContent:function(req,res,next){
		pool.getConnection(function(err,connection){
			var body = req.body.data;
			var body = boby.replace(/\s+/g, "") ;
			var data= body.split(",");
			var len = data.length,
			    i = 0;
			var pushcont = [];
			(function(i,len,count,callback){
				for(;i < len;i++){
					connection.query($sql.insert,[data[i].medical_id,data[i].modifier_id,data[i].record_type,data[i].record_content,data[i].hospital,data[i].doctor,data[i].diagnosis_time,data[i].record_id,data[i].note,data[i].modify_time],function(err,result){
						if(result){
							pushcont.push(data[i].record_id+"推送成功");
							if(++count === len){
								callback();
							}
						}else{
							pushcont.push(data[i].record_id+"推送失败");
							if(++count === len){
								callback();
							}
						}
					});
				}
			}(0,data.length,0,function(){
				res.json({
					state:'1',
					msg:'推送完成'
				});
			}));
			connection.release();
		});
	}
}