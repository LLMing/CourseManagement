var express = require('express');
var router = express.Router();

var regist = require('../database/regist/regist');
var login = require('../database/login/login');
var updateUser = require('../database/update/update');
var Dossier = require('../database/dossierManage/dossier');
var captcha = require('../database/regist/captcha');
var repassword = require('../database/repassword/repassword');
var content = require('../database/dossierContent/content');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


//注册
router.get('/getCode',function(req,res,next){
	captcha.captcha(req,res,next);
});//获取验证码
router.get('/compareCode',function(req,res,next){
	captcha.compareCaptcha(req,res,next);
});//对比验证码
router.get('/regist',function(req,res,next){
	regist.add(req,res,next);
});//注册


//登陆
router.get('/login',function(req,res,next){
	login.queryByPhone_no(req,res,next);
});


//填写个人资料
router.post('/addBaseMessage',function(req,res,next){
	updateUser.update(req,res,next);
});


//查看个人基本信息
router.get('/loadPersonal',function(req,res,next){
	updateUser.queryByUser_id(req,res,next);
});


//创建病例夹
router.post('/addDossier',function(req,res,next){
	Dossier.addDossier(req,res,next);
});


//修改病例夹资料
router.post('/updateBaseMessage',function(req,res,next){
	Dossier.updateDossier(req,res,next);
});


//删除病例夹
router.get('/deleteDossier',function(req,res,next){
	Dossier.deleteDossier(req,res,next);
});


//查看病例夹
router.get('/listForUserName',function(req,res,next){
	Dossier.queryAllByRight(req,res,next);
});

//分享病历夹
router.get('/shareDossier',function(req,res,next){
	Dossier.shareDossier(req,res,next);
});
//获取病历夹
router.get('/beShareDossier',function(req,res,next){
	Dossier.obtainDossier(req,res,next);
});

//删除病例夹权限
router.post('/deleteright',function(req,res,next){
	Dossier.deleteRight(req,res,next);
});

//获取某病例夹所有权限
router.get('/queryMedicalRight',function(req,res,next){
	Dossier.queryMedicalRight(req,res,next);
});


//修改密码
router.get('/getcaptcha',function(req,res,next){
	repassword.getcaptcha(req,res,next);
});//获取验证码

router.get('/loadBaseMessage',function(req,res,next){
	repassword.compareCaptcha(req,res,next);
});//对比验证码

router.get('/modifypassword',function(req,res,next){
	repassword.modifyPassword(req,res,next);
});//修改密码


//病例内容
router.post('/addRec',function(req,res,next){
	content.addDossier(req,res,next);
});//添加病例内容

router.post('/superResource',function(req,res,next){
	content.updateContent(req,res,next);
});//修改病例内容

router.post('/deleteRec',function(req,res,next){
	content.deleteContent(req,res,next);
});//删除病例内容

router.get('/getRecs',function(req,res,next){
	content.queryAllContent(req,res,next);
});//查看病例内容

module.exports = router;
