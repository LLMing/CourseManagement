//修改个人资料：
var mysql = require('mysql');
var $conf = require('../../conf/db');
var $util = require('../../util/util');
var $sql = require('./updatesql');

//1,使用连接池，提升性能
var pool = mysql.createPool($util.extend({},$conf.mysql));

//2.向前台提交JSON方法的简单封装
var jsonWrite = function(res,ret){
	if(typeof ret === 'undefined'){
		res.json({
			state:'0',
			msg:'操作失败'
		});
	}else{
		res.json(ret);
	}
};

module.exports = {
	update: function(req,res,next){
		//获取从前台提交来的数据
		var param = req.body;
		//判断必选项是否都做了填写
		console.log(param);
		if(param.name == null || param.sex == null || param.birthday == null || param.address == null || param.email == null || param.documentType == null || param.documentNumber == null || param.phoneNumber == null){
			res.json({
				state:'0',
				msg:'必填项未填写完整'
			});
			return;
		}

		pool.getConnection(function(err,connection){
			console.log(param.ID);
			connection.query($sql.queryByUser_id,param.userID,function(err,result){
				if(result == 0){
					res.json({
						state:'0',
						msg:'用户不存在'
					});
					return;
				}
				var sql = connection.query($sql.update,[param.name,param.sex,param.birthday,param.bloodType,param.allergyThing,param.address,param.email,param.documentType,param.documentNumber,param.phoneNumber,param.high,param.weight, +param.userID],function(err,result){
				// console.log(result);
				console.log(sql.sql);
				if(result.affectedRows > 0){
					connection.query($sql.queryByUser_id,param.userID,function(err,result){
						console.log(result[0]+"param.user_id"+param.userID)
						res.json({
							state:'1',
							msg:'操作成功',
							data:result
						});
						return;
					});
				}else{
					res.json({
						state:'0',
						msg:'操作失败'
					});
					return;
				}
				console.log(result);
				});
				connection.release();
			});
		});
	},

	queryByUser_id:function (req, res, next) {
		var param = req.query || req.params;
        pool.getConnection(function(err, connection) {
            connection.query($sql.queryByUser_id, param.userID, function(err, result) {
            	if(result == 0){
            		res.json({
            			state:'0',
            			msg:'无此用户'
            		});
            		return;
            	}
                jsonWrite(res, result);
                connection.release();

            });
        });
    }
};
