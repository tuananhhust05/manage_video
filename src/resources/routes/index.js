const HomeRouter=require('./home');  // import thằng route con; ở trong cùng 1 
const CrudCourseRouter=require('./crudcourse')
const HomePageRouter=require('./homepage')
const TkUserRouter= require('./tkuser')
function route(app){  // tạo hàm

app.use('/tkuser',TkUserRouter)

// khắt khe hơn phải lên đầu không nó quét từ trên xuống là bỏ mẹ
app.use('/crudcourse',CrudCourseRouter)



// làm như này để phân nhánh tốt hơn 
app.use('/home',HomeRouter); // set request user; gọi đến route con ; gọi đến 1 hàm 
  // trong thằng này còn nhiều action con nữa 

app.use('/',HomePageRouter)// trang đầu tiên 


}

module.exports=route; // export thằng route đó ra ngoài 
