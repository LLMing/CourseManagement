var researchsql = {
	querySettplan:'select * from settplan where cagree="同意"',
	updateRagree:'update settplan set ragree="同意" where tid=? and course_id=?',
	updatedisRagree:'update settplan set ragree="否定" where tid=? and course_id=?'

}

module.exports = researchsql;