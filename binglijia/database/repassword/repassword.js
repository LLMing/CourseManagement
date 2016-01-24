var mysql = require('mysql');
var $conf = require('../../conf/db');
var $util = require('../../util/util');
var $sql = require('./repasswordsql');
var request = require('request');

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
	getcaptcha:function(req,res,next){
		pool.getConnection(function(err,connection){
			var param = req.query || req.params;
			connection.query($sql.queryByPhone_no,param.phoneNumber,function(err,result){
				console.log(result);
				if(result == 0){
					res.json({
						state:'0',
						msg:'用户不存在'
					});
					return;
				}
				function num(){
					var mm = Math.random();
					var six = "";
					if(mm>0.1){
						six = Math.round(mm*1000000);
					}else{
						mm += 0.1;
						six = Math.round(mm*1000000);
					}
					return six;
				}
				var captcha = num();
				console.log(captcha);
				connection.query($sql.updateCaptcha,[captcha, +param.phoneNumber],function(err,result){
					if(result){
						if(result.affectedRows > 0){
							var options = {
								method:'GET',
								url:'http://utf8.sms.webchinese.cn',
								qs:{
									Uid:'diantongtech',
									Key:'cff42782be8516384393',
									smsMob:param.phoneNumber.toString(),
									smsTEXT:'您的验证码为：'+captcha+',切不可随意泄露'
								},
								headers:{
									'content-type':'application/json',
									accept:'application/json'
								}
							};

							request(options,function(error,response,body){
								if(error) throw new Error(error);
								res.json({
									state:body
								});
								console.log(body);
							});
						}else{
							res.json({
								state:'0',
								msg:'获取验证码失败'
							});
							return;
						}
					}else{
						res.json({
							state:'0',
							msg:'未找到数据'
						});
						return;
					}
					// connection.release();
				});
				connection.release();
			});
		});
	},
	compareCaptcha:function(req,res,next){
		pool.getConnection(function(err,connection){
			var param = req.query || req.params;
			connection.query($sql.queryByPhone_no,param.phoneNumber,function(err,result){
				if(result == 0){
					res.json({
						state:'0',
						msg:'无此用户'
					});
					return;
				}
				if(param.captcha == result[0].captcha){
					res.json({
						state:'1',
						msg:'验证码正确'
					});
					return;
				}else{
					res.json({
						state:'0',
						msg:'验证码不正确，请重新输入'
					});
				}
			});
			connection.release();
		});
	},
	modifyPassword:function(req,res,next){
		pool.getConnection(function(err,connection){
			var param = req.query || req.params;
			connection.query($sql.updatePassword,[param.password, +param.phoneNumber],function(err,result){
				console.log(result);
				if(result.affectedRows > 0){
					res.json({
						state:'1',
						msg:'操作成功'
					});
					return;
				}else{
					res.json({
						state:'0',
						msg:'操作失败'
					});
					return;
				}
				connection.release();
			});
		});
	}
};