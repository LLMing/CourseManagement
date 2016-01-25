var aplansql = {
	insertAteachPlan:'INSERT INTO ateachplan(course_name,course_id,course_time,category,class_id) VALUES(?,?,?,?,?)',
	queryAllPlan:'select * from ateachplan',
	updatePlan:'update ateachplan set job_title=?,class_number=?,max_wtime=?,min_wtime=? where course_id=?',
	// queryTeachPlan:'select * from teachingplan where course_id=?',
	// insertTeachPlan:'INSERT INTO teachingplan(course_name,course_id,course_time,category,class_id,job_title,class_number,max_wtime,min_wtime) VALUES(?,?,?,?,?,?,?,?,?)',
	// updateTeachPlan:'update teachingplan set job_title=?,class_number=?,max_wtime=?,min_wtime=? where course_id=?',
	updateAteachPlan:'update ateachplan set relea="1" where course_id=?',
	querySettPlan:'select * from settplan where ragree="同意"',
	updateAagree:'update settplan set aagree="同意" where tid=? and course_id=?',
	queryByAagree:'select * from settplan where aagree="同意"',
	updatedisAagree:'update settplan set aagree="否定" where tid=? and course_id=?'
};
module.exports = aplansql;