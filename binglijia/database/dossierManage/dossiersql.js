var dossiersql = {
	insert:'INSERT INTO medical_record(medical_id,avatar_link, name, sex, birth_data, blood_type, allergy, address, contact_phone, email,document_type,document_number,create_type, medical_name,manager_id,high,weight) VALUES(0,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
	insertJurisdiction:'INSERT INTO medical_jurisdiction(medical_id,user_id,user_right) VALUES(?,?,?)',
    update:'update medical_record set avatar_link=?, name=?, sex=?, birth_data=?,blood_type=?, allergy=?, address=?, contact_phone=?, email=?, document_type=?, document_number=?, create_type=?, high=?, weight=? where medical_id=?',
    forbidden: 'update medical_record set forbidden="1" where medical_id=?',
    queryByUser_id:'select user_right from medical_jurisdiction where user_id=? and medical_id=?',
    queryBymedical_id: 'select * from medical_record where medical_id=?',
    queryAllByRight:'select * from medical_record a left join medical_jurisdiction b on a.medical_id=b.medical_id where b.user_id=? and  b.forbidden ="0"',
    queryByRight:'select * from medical_jurisdiction where medical_id=?',
    queryShare:'select user_right from medical_jurisdiction where user_id=? and medical_id=?',
    insertQrcode:'INSERT INTO qrcode(user_id,medical_id,user_right,qrcode) VALUES(?,?,?,?)',
    queryQrcode:'select * from qrcode where qrcode=?',
    updateManager:'update medical_record set manager_id=? where medical_id=?',
    queryAllUserByUser_id:'select a.medical_id ,a.user_id,a.user_right,b.phone_no,b.avatar_link,b.user_name,b.sex from medical_jurisdiction a left join persional_data b on a.user_id=b.user_id where a.medical_id=? and a.forbidden = 0',
    deleteRight:'update medical_jurisdiction set forbidden="1" where user_id=? and medical_id=?',
    charset:'utf8_general_ci'
}

module.exports = dossiersql;