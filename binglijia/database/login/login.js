//完成数据库中的密码与提交密码的对比，
//如果相同，则返回“登陆成功”信息，否则，返回“登陆失败，密码不正确”

var mysql = require('mysql');
var $conf = require('../../conf/db.js');
var $util = require('../../util/util');
var $sql = require('./loginsql');

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

//与MySQL中的密码进行比对
module.exports = {
	queryByPhone_no:function(req,res,next){
		//var phone_no = +req.query.phone_no;//为了拼凑正确的sql语句，这里要将手机号转整数
		pool.getConnection(function(err,connection){
			//获取前台页面传过来的参数
			var param = req.query || req.params;
			console.log(param);

			connection.query($sql.queryByPhone_no, param.phoneNumber,function(err,result){
				if(result == 0){
					res.json({
						state:'0',
						msg:'无此用户'
					});
					return;
				}
				if(result[0].login_password == param.password){
					res.json({
						state:'1',
						msg:'登陆成功',
						date:result[0]
					});
					return;
				}
				else{
					res.json({
						state:'0',
						msg:'账号或密码错误'
					})
				}
				console.log(result);
				//释放连接
			});
			connection.release();
		});		
	}
};