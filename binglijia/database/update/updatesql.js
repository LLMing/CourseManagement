var updatesql = {
	update:'update persional_data set name=?,sex=?,birth_data=?,blood_type=?,allergy=?,address=?,email=?,document_type=?,document_number=?,contact_phone=?,high=?,weight=? where user_id=?', 
	queryByPhone_no:'select * from persional_data where phone_no=?',
	queryByUser_id:'select * from persional_data where user_id=?',
	charset:'utf8_general_ci'
};
module.exports = updatesql;