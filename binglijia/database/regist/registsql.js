//注册的SQL语句，只有向数据库中插入数值，不要要删除和修改

var registsql = {
	insert:'INSERT INTO persional_data(user_id,phone_no,login_password) VALUES(0,?,?)',
	insertCaptcha:'INSERT INTO captcha(phone_no,captcha) VALUES(?,?)',
	queryPhone_no:'select * from captcha where phone_no=?',
	queryByPhone_no:'select * from persional_data where phone_no=?',
	charset:'utf8_general_ci'
};
module.exports = registsql;