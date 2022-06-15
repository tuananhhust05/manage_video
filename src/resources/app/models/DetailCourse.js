const mongoose =require('mongoose');
const Schema=mongoose.Schema;


const DetailCourse= new Schema({  // khống thấy id=> lưu ý chỗ này
    TenBai:{type:String},
    Image:{type:String},
    Diem:{type:String},
    TinhTrang:{type:String},
    
    // default là cài mặc định khi không có gì thì hiện 
    
})

// chữ thường , số nhiều  tự tạo ra connection ; 
// detailcourse là tên table; nên đặt ở số nhiều 
// nếu trong db không có thì hệ thống sẽ tự tạo ra 1 bảng.
module.exports= mongoose.model('detailcourse',DetailCourse) // xuất ra dữ liệu dạng models
// tự map 