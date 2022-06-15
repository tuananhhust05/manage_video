const express=require('express');//khai báo
const router= express.Router();  // khởi tạo đối tượng router 

const TkUserController = require('../app/controllers/TkUserController');// import 


// chấm bài 
router.post('/chambai',TkUserController.chambai); // phức tạp đưa lên đầu 

//show chi tiết khóa học 
router.get('/show/:slug',TkUserController.show);
// show bài kiểm tra 
router.get('/:slug/:data',TkUserController.showtest);




router.get('/:slug',TkUserController.index);// để luu mail 


module.exports=router;