var captcha = function num(){
	var mm = Math.random();
	var six = "";
	if(mm>0.1){
		six = Math.round(mm*1000000);
	}else{
		mm += 0.1;
		six = Math.round(mm*1000000);
	}
	return six;
};
console.log(captcha());