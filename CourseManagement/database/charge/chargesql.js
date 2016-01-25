var chargesql = {
	queryteachPlan:'select * from settplan',
	updateAgree:'update settplan set cagree="同意" where tid=? and course_id=?',
	updatedisCagree:'update settplan set cagree="否定" where tid=? and course_id=?'
}
module.exports = chargesql;