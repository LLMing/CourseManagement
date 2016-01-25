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
	compentPassword:function(req,res,next){

		pool.getConnection(function(err,connection){
			var body = req.body;
			console.log(body);
			connection.query($sql.queryByUser_id,body.User_id,function(err,result){
				if(result == 0){
					req.flash('error', '用户不存在!');
					return res.redirect('/');
				}
				if(result[0].User_Password == body.User_Password){
					if(result[0].User_lever == 3){
						req.flash('success', '登陆成功!'+"欢迎你,教师"+result[0].User_id);
						return res.redirect('/teacher');
					}else if(result[0].User_lever == 0){
						req.flash('success', '登陆成功!'+"欢迎你，教务处"+result[0].User_id);
						return res.redirect('/academic');
					}else if(result[0].User_lever == 1){
						req.flash('success', '登陆成功!'+"欢迎你，教务人员"+result[0].User_id);
						return res.redirect('/research');
					}else{
						req.flash('success', '登陆成功!'+"欢迎你，教研室"+result[0].User_id);
						return res.redirect('/charge');
					}
				}else{	
					req.flash('error', '账号或密码错误！请重新输入');
					return res.redirect('/');
				}
			});
			//释放连接池
			connection.release();
		});
	}
};