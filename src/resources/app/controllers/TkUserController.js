var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const Course =require('../models/Course') // khai báo mpdel=> thao tác với database 
const DetailCourse =require('../models/DetailCourse') 
const ketqua =require('../models/ketqua') 
// truyền dữ liệu người dùng qua đây 
var email;// biến toàn cục
var mail=new Object();
class TkUserController{
     


      async index(req,res,next){  // tạo phương thức trả về view 
        email=req.params.slug;
        let courses = await Course.find({});
        courses=courses.map(course=>course.toObject())// map sang Object()
        //res.json(courses);
        
        mail.name=email;
        res.render('tkuser/home',{mail:mail,courses:courses,layout: 'tkuser'});  // handlebar không cho hiển thị nhưng ta có thể lấy ra dùng 
      }
           // thằng nào truyền ra cũng phải truyền đc email để giữa được  link trến layout 



//show chi tiết khóa học detail dùng async 
       async  show(req,res,next){
        // ghi lại thông tin đăng nhập
        MongoClient.connect(url, function(err, db) {
          if (err) return next(err);
          var dbo = db.db("F8_education_dev");
          
          //ghi dữ liệu truy câp 
           var today = new Date();
           var time= today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
           var myobj=new Object();
           myobj.Time=String(time);
           myobj.taikhoan=String(email);
           myobj.khoahoc=String(req.params.slug);
           dbo.collection("quanlytruycap").insertOne(myobj, function(err, result) {
             if (err) throw err;
           });
        });
        // lấy dữ liệu của khóa học 
         var tablecourse=[]; // khai báo mảng chứa khóa học
        //console.log(req.params.slug);
        // lấy tất lên bố mày xử cả thể 
       let detailcourses = await DetailCourse.find({});// hệ thống tự đưa đến bảng 
       detailcourses=detailcourses.map(detailcourse=>detailcourse.toObject());// map sang Object()
       for(var i=0;i<detailcourses.length;i++){
           if(detailcourses[i].slug==req.params.slug){
            tablecourse.push(detailcourses[i])
           }
       }
       // table là danh sách những bài học; giờ quét từ đầu đến cuối, xét từng thằng một
       for(var j=0;j<tablecourse.length;j++){
        tablecourse[j].tenkhoa=req.params.slug;  // header 
       }

       var slug = new Object();
       slug.name=req.params.slug;


       // chỉnh dữ liệu trước khi trả ra 
      for(var h=0;h<tablecourse.length;h++){
        // lấy dữ liệu chung 
        let ketquas = await ketqua.find({taikhoan:email,khoahoc:req.params.slug,tenbai:tablecourse[h].TenBai}); // tìm dưới bảng kết quả 
        ketquas=ketquas.map(detailcourse=>detailcourse.toObject());
       
        // tính trung bình 
        var tong=0;
        var dem=0;
        var tb=0;
        while(dem<ketquas.length)
        {tong=Number(tong) + Number(ketquas[dem].diembaithi);
          dem=dem+1;
        }
        
     
        var tb=tong/ketquas.length;
        if(ketquas!=null){
          if(ketquas.length>0){
            tablecourse[h].TinhTrang="Done the test";
            // tình trạng ok mới cập nhật điểm
            tablecourse[h].Diem= String(Number(tb));
          }
        }

        // lấy 5 đầu điểm gần nhất
        if(ketquas.length<5){
          for(var y=ketquas.length;y<5;y++){
            var x=new Object();
            x.diembaithi="0";
            ketquas.push(x);
          }
        }
        tablecourse[h].lanthunhat=ketquas[ketquas.length-1].diembaithi;
        tablecourse[h].lanthunhai=ketquas[ketquas.length-2].diembaithi;
        tablecourse[h].lanthuba=ketquas[ketquas.length-3].diembaithi;
        tablecourse[h].lanthutu=ketquas[ketquas.length-4].diembaithi;
        tablecourse[h].lanthunam=ketquas[ketquas.length-5].diembaithi;
      }  // hoàn thiện detail course 


       
       // tính điểm trung bình cả khóa 
       var tongkhoa=0;
       var x=0 ;
       var tbkhoa=0;
       while(x<tablecourse.length)
       {
        tongkhoa=tongkhoa+ Number(tablecourse[x].Diem);
        x=x+1;
       }
       tbkhoa=tongkhoa/tablecourse.length;
       //console.log(tbkhoa);
       var diemtrungbinh =new Object();
       diemtrungbinh.diem=String(tbkhoa)
      res.render('courseuser/tablecourse/table',{diemtrungbinh:diemtrungbinh,mail:mail,tablecourse:tablecourse,slug:slug,layout:null})
  }
 



       // show bài kiểm tra 
       // get
       showtest(req,res,next){
        

        // lấy dữ liệu từ bảng 
        MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("F8_education_dev");
          dbo.collection("dethi").find({course:req.params.slug,TenBai:req.params.data}).toArray(function(err, result) {
            if (err) throw err;
            //console.log(result);
            for(var i=0;i<result.length;i++){
              result[i].thutu=i+1;
              result[i].soluong=result.length;
              result[i].tenbai=req.params.data;
              result[i].khoahoc=req.params.slug;
            }
            res.render('courseuser/tablecourse/test',{mail:mail,result:result,layout:null})
            db.close();
          });
        });
       }


       //post
       // thiết kế công thức chấm chung ; đưa vào các dữ liệu ẩn 
       chambai(req,res,next){
         // trả về 2 mảng; 1 mảng là câu trả lời; 1 mảng là đáp án; sau đó so sánh hai mảng đó với nhau từ đầu đến cuối.
        // số lượng nhận đc là 1 mảng 
        var diem=0;
      
        for(var i=0;i<Number(req.body.soluong[0]);i++){
          if(req.body.traloi[i]==req.body.da[i]){
            diem=diem+1;
          }
        }
        diem=diem/Number(req.body.soluong[0])*10;
        // không send được số 
        //console.log(diem);


        // ghi vào database 
        MongoClient.connect(url, function(err, db) {
          if (err) return next(err);
          var dbo = db.db("F8_education_dev");
          var ketqua = new Object();

          ketqua.taikhoan=email;

          // kiểm tra xem phải là mảng không 
          if (req.body.khoahoc.count>1){ketqua.khoahoc=req.body.khoahoc[0];}
          else ketqua.khoahoc=req.body.khoahoc;
          
          if (req.body.tenbai.count>1){ketqua.tenbai=req.body.tenbai[0];} 
          else  ketqua.tenbai=req.body.tenbai;
          
          ketqua.diembaithi=String(diem);
          var today = new Date();
          var time= today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();

          ketqua.thoigian=String(time);
          dbo.collection("ketquas").insertOne(ketqua, function(err, res) {  // thêm req.body là 1 đối tượng 
            if (err) return next(err);
            db.close();  // lưu ý không đóng kết nối luôn 
          });
        
         
        });

        // chuyển trang chi tiết 
        res.redirect('/tkuser/'+email);
      }
}

module.exports=new TkUserController;