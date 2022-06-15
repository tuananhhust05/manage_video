const express=require('express');//khai báo
const router= express.Router();  // khởi tạo đối tượng router 

const CrudController = require('../app/controllers/CrudController');


router.get('/editcourse/:slug',CrudController.ShowUpdateCourse);
router.post('/storeupdatecourse',CrudController.StoreUpdateCourse);  // hàm màu vàng 


// xóa khóa học 
router.post('/deletecourse/:slug',CrudController.DeleteCourse);
module.exports=router; 