var repasswordsql = {
	updateCaptcha:'update persional_data set captcha=? where phone_no=?',
	queryByPhone_no:'select phone_no,captcha from persional_data where phone_no=?',
	updatePassword:'update persional_data set login_password=? where phone_no=?'
}

module.exports = repasswordsql;