var teachersql = {
	queryAllPlan:'select * from ateachplan where relea=1',
	queryPlanCount:'select * from teacher where tid=?',
	queryCourse:'select * from ateachplan where course_id=?',
	updateCourse_idf:'update teacher set course_idf=? where tid=?',
	updateCourse_ids:'update teacher set course_ids=? where tid=?',
	insertSettplan:'INSERT INTO settplan(tid,course_id,wtime,note) VALUES(?,?,?,?)',
	queryViewPlan:'select * from settplan'
};
module.exports = teachersql;