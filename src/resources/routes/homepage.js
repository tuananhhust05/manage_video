const express=require('express');//khai báo
const router= express.Router();  // khởi tạo đối tượng router 
var Excel = require('exceljs');
const HomePageController = require('../app/controllers/HomePageController');

router.get('/',HomePageController.index);


// form login 
// get
router.get('/login',HomePageController.login);
//post
router.post('/storelogin',HomePageController.storelogin);




// đăng ký 
// get 
router.get('/register',HomePageController.register);
//post 
router.post('/storeregister',HomePageController.storeregister);



// login admin 
// get 
router.get('/admin',HomePageController.loginadmin);
router.post('/storeloginadmin',HomePageController.storeloginadmin);

// nhớ export 
module.exports=router;