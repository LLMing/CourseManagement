//实现与MySQL的交互,完成注册功能

var mysql = require('mysql');
var $conf = require('../../conf/db');
var $util = require('../../util/util');
var $sql = require('./dossiersql');

//使用连接池，提升性能；
var pool = mysql.createPool($util.extend({},$conf.mysql));

//向前台返回JSON方法的简单封装
//错误信息返回
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

//成功存储信息
module.exports = {
	addDossier:function(req,res,next){
		pool.getConnection(function(err,connection){
			//获取从前台页面传过来的参数
			var param = req.body;
			console.log(param);
			//判断必填项是否都填写了
			if(param.name == null || param.sex == null || param.birth_data == null || param.address == null || param.user_id == null || param.create_type == null){
				console.log(param.name);
				console.log(param.sex);
				console.log(param.birth_data);
				console.log(param.address);
				console.log(param.user_id);
				console.log(param.create_type);
				res.json({
					state:'0',
					msg:'必填项不能为空'
				});
				return;
			}
			var sql = connection.query($sql.insert,[param.avatar_link, param.name, param.sex, param.birth_data, param.blood_type, param.allergy, param.address, param.contact_phone, param.email, param.document_type, param.document_number, param.create_type, param.medical_name,param.user_id,param.high,param.weight],function(err,result){
				if(result){
					var insertId = result.insertId;
					console.log(result.insertId);
					connection.query($sql.insertJurisdiction,[result.insertId,param.user_id,'0'],function(err,result){
						if(result){
							connection.query($sql.queryBymedical_id,insertId,function(err,result){
								if(result != 0){
									console.log(sql.sql);
									res.json({
										state:'1',
										msg:'创建成功',
										data:result
									});
								}
							});
						}
					});
				}else{
					console.log(err);
					res.json({
						state:'0',
						msg:'创建失败'
					});
				}
				connection.release();
			});
		});
	},
	updateDossier:function(req,res,next){
			//获取前台提交参数
			var param = req.body;

			//判断必选项是否都填写
			console.log(param.name+"--"+param.sex+"--"+param.birth_data+"--"+param.medical_id);
			if(param.name == null || param.sex == null || param.birth_data == null || param.medical_id == null){
				res.json({
					state:'0',
					msg:'必填项未填写完整'
				});
				return;
			}

			pool.getConnection(function(err,connection){
				connection.query($sql.queryBymedical_id,param.medical_id,function(err,result){
					if(result == 0){
						res.json({
							state:'0',
							msg:'病例夹不存在'
						});
						return;
					}
					connection.query($sql.update,[param.avatar_link, param.name, param.sex, param.birth_data,param.bloodType,param.allergy,param.address, param.contact_phone, param.email,param.document_type,param.document_number,param.create_type,param.high,param.weight, +param.medical_id],function(err,result){
						if(result.affectedRows > 0){
							connection.query($sql.queryBymedical_id,[param.medical_id],function(err,result){
								console.log(result);
								res.json({
									state:'1',
									msg:'修改成功',
									data:result
								});
								return;
							});
						}else{
							res.json({
								state:'0',
								msg:'修改失败'
							});
						}
						console.log(result);
						connection.release();
					});
				});
			});
	},
	deleteDossier:function(req,res,next){
		var param = req.query || req.params;
		console.log(param);
		pool.getConnection(function(err,connection){
			connection.query($sql.queryByUser_id,[param.user_id,param.medical_id],function(err,result){
				// console.log(result[0].user_right);
				if(result[0].user_right == 0){
					connection.query($sql.forbidden,param.medical_id,function(err,result){
						console.log(result);
						if(result.affectedRows > 0){
							res.json({
								state:'1',
								msg:'修改成功'
							});
							return;
						}else{
							res.json({
								state:'0',
								msg:'修改失败'
							});
						}
					});
				}else{
					res.json({
						state:'0',
						msg:'没有删除权限'
					});
				}
				//还未添加路由@@！！
			});
			connection.release();
		});
	},
	queryAllByRight:function(req,res,next){
		pool.getConnection(function(err,connection){
			var param = req.query || req.params;
			connection.query($sql.queryAllByRight,param.user_id,function(err,result){
				console.log(result);
				res.json({
					state:'1',
					msg:'获取成功',
					data:result
				});
			});
			connection.release();
		});
	},
	queryMedicalRight:function(req,res,next){
		pool.getConnection(function(err,connection){
			var param = req.query || req.params;
			console.log(param.medical_id);
			connection.query($sql.queryAllUserByUser_id,param.medical_id,function(err,result){
				if(result.length>0){
					res.json({
						state:'1',
						msg:'获取成功',
						data:result
					});
				}else{
					res.json({
						state:'0',
						msg:'参数错误',
					});

				}			
			});			
			connection.release();
		});
	},
	shareDossier:function(req,res,next){
		var param = req.query || req.params;
		var querystring = require('querystring');
		pool.getConnection(function(err,connection){
			console.log(param.user_id+"---"+param.medical_id);
			connection.query($sql.queryShare,[param.user_id,param.medical_id],function(err,result){
				console.log(result);
				if(typeof result[0] ==='undefined'){
					res.json({
						state:'0',
						msg:'非法操作'
					});
				}else{
					if(result[0].user_right == 0){
						function num(){
						var mm = Math.random();
						var six = "";
						if(mm>0.1){
							six = Math.round(mm*10000000000);
						}else{
							mm += 0.1;
							six = Math.round(mm*10000000000);
						}
						return six;
						};
						var qrcode = num();
						connection.query($sql.insertQrcode,[param.user_id,param.medical_id,param.user_right,qrcode],function(err,result){
							if(result){
								res.json({
									state:'1',
									msg:qrcode
								});
								return;
							}else{
								res.json({
									state:'0',
									msg:'分享失败'
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
					
				}
			});
		});
	},
	obtainDossier:function(req,res,next){
		var param = req.query || req.params;
		pool.getConnection(function(err,connection){
			connection.query($sql.queryQrcode,param.qrcode,function(err,result){
				console.log(result);
				var message = result;
				if(result != 0){
						connection.query($sql.insertJurisdiction,[result[0].medical_id,param.user_id,result[0].user_right],function(err,result){
							if(result){
								connection.query($sql.queryBymedical_id,message[0].medical_id,function(err,result){
									res.json({
										state:'1',
										msg:'获取病历夹成功',
										data:result,
										user_right:message[0].user_right
									});
								return;
								});
							}else{
								res.json({
									state:'0',
									msg:'获取病历夹失败'
								});
								return;
							}
						});
				}else{
					res.json({
						state:'0',
						msg:'二维码扫描失败'
					});
				}
			});
			connection.release();
		});
	},
	deleteRight:function(req,res,next){
		pool.getConnection(function(err,connection){
			var param = req.body;
			var body = param.data;
			var query = body.replace(/\s+/g, "");
			var data = query.split(",");
			var len = data.length,
			    i = 0;
			console.log(data);
			console.log(data[0]);
			console.log(data[1]);
			var delecont = [];
			connection.query($sql.queryShare,[param.user_id,param.medical_id],function(err,result){
				if(result){
					if(result[0].user_right == 0){
						(function(i,len,count,callback){
							for (; i < len; i++) {
								connection.query($sql.deleteRight,[data[i],param.medical_id],function(err,result){
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
					}else{
						res.json({
							state:'0',
							msg:'没有删除权限'
						});
					}
				}else{
					return next(err);
				}
			})
			connection.release();
		});

	}
};