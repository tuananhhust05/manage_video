const express = require('express')  // nạp thư viện đi vào node modul tải express lên 
const fileupload=require('express-fileupload')
const path= require('path');// để chỉnh sửa đường dẫn cho phù hợp với cấu trúc 
const morgan= require('morgan');//import thư viện giúp hiển thị thông tin request từ users
const { engine } = require ('express-handlebars'); // import thư viện handlebar giúp ta trả ra view
const app = express(); // trả về 1 đối tượng để có thể xây dựng web site; sử dụng xuôn suốt; đây là thằng được dùng để build
const port = 23000; // run website ở cổng nào 


const sessions=require('express-session');// khai báo session 
const cookieParser = require("cookie-parser");
app.use(cookieParser());


// cực kỳ quan trọng 
app.use(fileupload());// dùng để upload file 


// cực kỳ quan trọng kết nối tất cả cho những thằng dùng model 
const db = require('./config/db')  // config thưu mục chứa db 
// connect to db 
db.connect()  



const route= require('./resources/routes'); // nhét các thằng route vào folder route giờ import để lôi ra
// sử dụng các hàm của nó ; không cần viết rõ index.js 
// route giúp thực hiện yêu cầu của người dùng kh gửi request lên 


// load file static lên 
// điều chỉnh để có thể load file dựa theo link folder trên trình duyệt
app.use(express.static(path.join(__dirname,'public')));  // load file tĩnh lên trình duyệt; không cần thiết lắm 


// middleware cực kỳ quan trọng trong xủ lý req 
// tạo lớp trung gian để đọc dữ liệu đưa lên từ form 
// quan trọng: body parse
// true: session
app.use(express.urlencoded({ extended: true }));  //miderware xử lý mã html được gửi lên 
app.use(express.json()) ; // midderware xử lý dữ liệu json được gửi lên  


// hiển thị request user gủi lên 
app.use(morgan('combined'));


// template engine ; import như nào thì nhét vào template engine như vậy
// tạo ra thằng hbs kế thừa từ thư viện handlebars
app.engine('hbs',engine({  // html sơ khai ; file động 
  extname:'.hbs'
}));    // config đuôi file là hbs


app.set('view engine', 'hbs');// dùng file đuôi hbs để hiển thị view 
// câu 1 định nghĩa thằng hbs bằng thư viện; set đối tượng view engine bằng với handlebars


// set đường link truy xuất vào view ( xem trên trang chủ handlbars)
app.set('views',path.join(__dirname,'resources','views')) // win dow hai dâu gạch chéo 
// trong express-handlebars thì các file render phải có layouts lá main.hbs
// layouts lại được






// nhét hết các tuyến đường vào folder route; giờ lôi ra 
route(app); // sử dụng hàm trong  folder route 




// 127.0.0.1 - localhost 

app.listen(port, () => {// khi lắng nghe đc thì ghi ra 
  console.log(`Example app listening at http://localhost:${port}`)
})
