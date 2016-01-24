var request = require("request");
var mysql = require('mysql');
var $conf = require('../../conf/db');
var $util = require('../../util/util');
var $sql = require('./registsql.js');

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
	captcha:function(req,res,next){
//验证数据库中是否已有此手机
		pool.getConnection(function(err,connection){
			var param = req.query || req.params;
			connection.query($sql.queryByPhone_no,param.phoneNumber,function(err,result){
				if(result != 0){
					res.json({
						state:'0',
						msg:'用户已存在'
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
				};
				var captcha = num();

				connection.query($sql.insertCaptcha,[param.phoneNumber,captcha],function(err,result){
					if(result){
						//发送短信验证
						console.log(param.phoneNumber.toString());

						var options = { method: 'GET',
							url: 'http://utf8.sms.webchinese.cn',
							qs: { 
								Uid:'diantongtech',
								Key: 'cff42782be8516384393',
								smsMob:param.phoneNumber.toString(), 
								smsTEXT: '您的验证码为:'+captcha+',切不可泄露' 
							},
							headers:
							{
								'content-type': 'application/json',
								accept: 'application/json' } 
							};

						request(options, function (error, response, body) {
							if(error) throw new Error(error);
							res.json({
								state:body
							});
							console.log(body);
							return;
						});
					}else{
						res.json({
							state:"0",
							msg:'获取验证码失败'
						});
					}
					// connection.release();
				});
				connection.release();
			});
		});
	},
	compareCaptcha:function(req,res,next){
		console.log(1);
		pool.getConnection(function(err,connection){
			var param = req.query || req.params;
			connection.query($sql.queryPhone_no,param.phoneNumber,function(err,result){
				if(result == 0){
					res.json({
						state:'0',
						msg:'验证码已失效，请重新获取'
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
						msg:'验证码不正确'
					});
				}
			});
			connection.release();
		});
	}
};
