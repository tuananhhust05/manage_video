const express=require('express');//khai báo
const router= express.Router();  // khởi tạo đối tượng router 


// qua hai tầng folder nên bắt buộc phải có hai dẫu chấm 
const HomeController = require('../app/controllers/HomeController');// import thằng controller 
// thằng controller này chứa các chức năng (funtion)


// sắp xếp từ trên xuống theo độ phức tạp ; xét xem nếu đường link của thằng sau vào thằng trước có nhận nhầm được không


// quản lý truy cập 
router.get('/quanlytruycap',HomeController.quanlytruycap);

// update video
//get
router.get('/updatevideo/:data/:slug',HomeController.updatevideo);
//post
router.post('/storeupdatevideo',HomeController.storeupdatevideo);


// download
router.get('/downloadbaihoc/:data/:slug',HomeController.downloadbaihoc);

// show
router.get('/showtest/:slug/:data',HomeController.showtest);

// update
//get
router.get('/updatetest/:slug/:data',HomeController.updatetest);
//post
router.post('/update/storeupdatebai',HomeController.storeupdatebai);

// thêm bài học 
router.post('/thembai/storethembai',HomeController.storethembai);
router.get('/thembai/:slug',HomeController.thembai);



// route nhận request của user theo thứ tự; để thằng create không trùng dlug; ta tiến hành cho nó chạy trước 
router.get('/createcourse',HomeController.createcourse);// yêu cầu nhập dữ liệu 
router.post('/storecourse',HomeController.storecourse);  // xử lý dữ liệu 


// khi bên kia gọi /news thì đến các route con; khi gọi route con thì cần gọi thêm phần trong route con quy định
// news/trangchu mới ra 

// đk khắt khe hơn cho lên trước tránh điều hướng nhầm
//router.get('/editcourse/:slug',HomeController.ShowUpdateCourse) // truy cập vào thông qua slug từ bảng chỉnh
router.get('/:slug',HomeController.show)  // phục vụ nhận data qua link 

router.get('/',HomeController.index); // cấu hình router; dấu '/' quy định request từ user
//newsController.index  hàm thực thi trả về view của news 
// thằng quy định request được gừi lên từ user chưa được đề cập rõ trong file này
// do ta đã bóc tách riêng route của news thanh file riêng nên bên ngoài kia sẽ quy định request user
 








// route dẫn tới phần update

// //router.post('/home/editcoursestrore',HomeController.StoreUpdateCourse)


module.exports=router; // export thằng new.js này ra ngoài 