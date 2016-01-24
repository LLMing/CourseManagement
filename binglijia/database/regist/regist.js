//实现与MySQL的交互,完成注册功能

var mysql = require('mysql');
var $conf = require('../../conf/db');
var $util = require('../../util/util');
var $sql = require('./registsql.js');

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
	add:function(req,res,next){
		pool.getConnection(function(err,connection){
			//获取前台页面传过来的参数
			var param = req.query || req.params;

			connection.query($sql.queryByPhone_no, param.phoneNumber,function(err,result){
				if(result!=0){
					res.json({
						state:'0',
						msg:'用户已存在'
					});
					return;
				}
				connection.query($sql.insert,[param.phoneNumber,param.password],function(err,result){
				if(result){
					connection.query($sql.queryByPhone_no, param.phoneNumber,function(err,result){
						res.json({
							state:'1',
							msg:'注册成功',
							userID:result[0].user_id
						});
					});
				}

				//以JSON形式，把操作结果返回给前台页
			});
			});
			connection.release();
		});
	}
};