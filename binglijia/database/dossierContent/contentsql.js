var contentsql = {
	queryRight:'select * from medical_jurisdiction where user_id=? and medical_id=?',
	insert:'INSERT INTO medical_chart(increment_id,medical_id,modifier_id,record_type,record_content,hospital,doctor,diagnosis_time,record_id,note,modify_time) VALUES(0,?,?,?,?,?,?,?,?,?,?)',
	update:'update medical_chart set hospital=?,diagnosis_time=?,modify_time=?,doctor=?,modifier_id=?,note=?,record_content=? where record_id=?',
	deleteContent:'update medical_chart set forbidden="1" where record_id=?',
	// queryAllContent:'select * from medical_chart where medical_id in(select medical_id from medical_jurisdiction where user_id=?)'
	queryContent:'select * from medical_chart where medical_id=? and forbidden="0"'
}
module.exports = contentsql;
