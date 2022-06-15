const Course =require('../models/Course') // khai báo mpdel=> thao tác với database 
var fs = require('fs'); // file systerm dùng để tạo ra các thao tác với file: xóa, sửa ...
// detail course model
const DetailCourse =require('../models/DetailCourse') 
const ketqua =require('../models/ketqua') // model 
var Excel = require('exceljs');// viết file excel 
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

// truyền dữ liệu giữa các action 
var tenkhoa;
var tenbai;
// đọc excel 
var XLSX= require("xlsx")


class HomeController { // contructors
    
    
   
   // khi gõ  /news trên trình duyệt thì nó sẽ trả về đây
    //[GET] /news 
    async index(req,res,next){  // tạo phương thức trả về view 

      // khi có lỗi sẽ truyền ra thằng next, tập trung các lỗi ở 1 middleware thôi
      //viết gọn hơn với arround function 

      let courses = await Course.find({});
      courses=courses.map(course=>course.toObject())// map sang Object()
      res.render('home',{courses:courses});  // handlebar không cho hiển thị nhưng ta có thể lấy ra dùng 

    }

    //show chi tiết khóa học detail dùng async 
    async  show(req,res,next){

      // lấy dữ liệu của khóa học 
       var tablecourse=[]; // khai báo mảng chứa khóa học
     
      // lấy tất lên bố mày xử cả thể 
       let detailcourses = await DetailCourse.find({});// không thể áp dụng thuật toán tìm kiếm cụ thể 
       detailcourses=detailcourses.map(detailcourse=>detailcourse.toObject());// map sang Object()
       for(var i=0;i<detailcourses.length;i++){
        if(detailcourses[i].slug==req.params.slug){
         tablecourse.push(detailcourses[i])
        }
       }
       
       // đếm số lần truy cập của từng thằng 
       for(var i=0; i< tablecourse.length;i++){
        let ketquas = await ketqua.find({khoahoc:req.params.slug,tenbai:tablecourse[i].TenBai}); // tìm dưới bảng kết quả 
        ketquas=ketquas.map(detailcourse=>detailcourse.toObject());
        
        tablecourse[i].solanlambai=ketquas.length;
       }

       var tenkhoa= new Object();
       tenkhoa.name=req.params.slug;
       res.render('courses/tablecourse/table',{tablecourse:tablecourse,tenkhoa:tenkhoa}) 
}
  
 


     //create GET
     createcourse(req,res,next){
       res.render('courses/create');    // nhóm những thằng cùng loại vào folder trong view dễ quản lý
     }
    // create POST 
    storecourse(req,res,next){
        // nhóm những thằng cùng loại vào folder trong view dễ quản lý
        // cách 1
        MongoClient.connect(url, function(err, db) {
          if (err) return next(err);
          var dbo = db.db("F8_education_dev");
         
          dbo.collection("courses").insertOne(req.body, function(err, res) {  // thêm req.body là 1 đối tượng 
            if (err) return next(err);
            //db.close();  // lưu ý không đóng kết nối luôn 
          });
         
        });
        res.redirect('/home');  // để ra ngoài tránh bị ghi đè bên trong ; trả thẳng về page chính
      
    }


    // thêm bài 
    // Get
     thembai(req,res,next){
      tenkhoa=req.params.slug;
      console.log(req.params.slug)// cần phải truy cập từ đầu 
      res.render('courses/tablecourse/thembai');
    }
    // post thêm bằng excel 
     storethembai(req,res,next){
      
      
      // lưu file vào hệ thống 
      var file=req.files.file;// req.files rất quan trọng 
      var filename=file.name;
      
      // xóa file có tên là filename 
      if(fs.existsSync('src/upload/'+filename)) // kiểm tra 1 file có tồn tại hay không nếu có thì xóa 
      { 
        fs.unlink('src/upload/'+filename, function (err) {
         if (err) throw err;
         console.log('File deleted!');
       });}
       else{
         console.log('File chưa từng được sử dụng');
       }

      file.mv('./src/upload/'+filename,function(err){  // upload file 
        if(err){
          res.send(err)
        }
        else{
          console.log("file uploaded")
        }
      })
      

    var do_alert = function(){  // setTime Out để việc upload hoàn tất.
      // lôi lên và đọc 
      // dẫn từ hosting ra thôi 
      var workbook=XLSX.readFile("src/upload/"+filename);// cả file  đường dẫn từ file mẹ 
      let worksheet=workbook.Sheets[workbook.SheetNames[0]];
      
      // lấy dữ liệu điền vào bảng detailcourses
      var detailcourses=new Object();
      detailcourses.TenBai=worksheet[`B2`].v;
      detailcourses.Image=worksheet[`A3`].v;
      detailcourses.Diem="0";
      detailcourses.TinhTrang="Didn't finish";
      detailcourses.slug=worksheet[`A2`].v; 
         // kiểm tra đường dẫn xem có hợp lý không
      if(detailcourses.slug!=tenkhoa){
        console.log(detailcourses.slug);
        console.log(worksheet[`A2`].v);
        console.log(tenkhoa);// store lấy đâu ra slug bạn 
        console.log("Đường dẫn không hợp lệ ");
        res.send("Đường dẫn trong file bị sai");
      }
      else
      {
        
        // lấy dữ liệu điền vào bảng dethi
            var dethi=[];
            let index=2;
            while(worksheet[`C${index}`]!=null){ // chạy đến khi gặp null
            const CauHoi= worksheet[`C${index}`].v;
            const a = worksheet[`D${index}`].v;
            const b = worksheet[`E${index}`].v;
            const c = worksheet[`F${index}`].v;
            const d = worksheet[`G${index}`].v;
            const dapan = worksheet[`H${index}`].v;
            const course = worksheet[`A2`].v;
            const TenBai = worksheet[`B2`].v;
            dethi.push({course:course,TenBai:TenBai,CauHoi:CauHoi,a:a,b:b,c:c,d:d,dapan:dapan})
            index=index+1;
          }
          // thêm dữ liệu vào databse 
          MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("F8_education_dev");
           
            dbo.collection("dethi").insertMany(dethi, function(err) {
              if (err) throw err;
              
              });
            dbo.collection("detailcourses").insertOne(detailcourses, function(err) {
              if (err) throw err;
              db.close();
              });
            res.redirect('/home');
            });
      }
        
    }
    setTimeout(do_alert, 2000);
    }
    
    
    // download bài học 
    downloadbaihoc(req,res,next){
      // lấy dữ liệu từ bảng dethi
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("F8_education_dev");
        // lấy dữ liệu trong bảng de thi để điền vào file excel 
        dbo.collection("dethi").find({course:req.params.data,TenBai:req.params.slug}).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          // điền file excel
          var workbook = new Excel.Workbook();

          workbook.creator = 'Me';  // thông tin không quan trọng 
          workbook.lastModifiedBy = 'Her';
          workbook.created = new Date(1985, 8, 30);
          workbook.modified = new Date();
          workbook.lastPrinted = new Date(2016, 9, 27);
          workbook.properties.date1904 = true;
        
          workbook.views = [
            {
              x: 0, y: 0, width: 10000, height: 20000,
              firstSheet: 0, activeTab: 1, visibility: 'visible'
            }
          ];
          var worksheet = workbook.addWorksheet('My Sheet');
          worksheet.columns = [
            { header: 'Tên khóa', key: 'course', width: 10 },
            { header: 'Tên Bài', key: 'TenBai', width: 10},
            { header: 'Câu hỏi', key: 'CauHoi', width: 100 },
            { header: 'a', key: 'a', width: 50 },
            { header: 'b', key: 'b', width: 50 },
            { header: 'c', key: 'c', width: 50 },
            { header: 'd', key: 'd', width: 50 },
            { header: 'dapan', key: 'dapan', width: 10}
          ];
          
          for(var i=0;i<result.length;i++)
           { worksheet.addRow({ course: result[i].course, TenBai: result[i].TenBai, CauHoi: result[i].CauHoi,a:result[i].a,b:result[i].b,c:result[i].c,d:result[i].d,dapan:result[i].dapan});}
          
        
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
          workbook.xlsx.write(res)
            .then(function (data) {
              res.end();
              console.log('File write done........');
            });
          

        });
      });
    }


    // show đề thi ; lấy dữ liệu trong bảng đề thi và show ra 
    showtest(req,res,next){
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
          res.render('courses/tablecourse/showtest',{result:result})
          db.close();
        });
      });
    }
  
    
    // updatebai get
    updatetest(req,res,next){
      // truyền dữ liệu cần xóa cho post thông qua biến toàn cục 
      tenkhoa=req.params.slug;
      tenbai=req.params.data;
      res.render('courses/tablecourse/updatetest')
    }

    // post update 
    storeupdatebai(req,res,next){

      

      // lưu file vào hệ thống 
      var file=req.files.file;// req.files rất quan trọng 
      var filename=file.name;

      //xóa file có tên giống 
       // xóa file có tên là filename 
       if(fs.existsSync('src/upload/'+filename)) // kiểm tra 1 file có tồn tại hay không nếu có thì xóa 
       { 
         fs.unlink('src/upload/'+filename, function (err) {
          if (err) throw err;
          console.log('File deleted!');
        });}
        else{
          console.log('File chưa từng được sử dụng');
        }


      file.mv('./src/upload/'+filename,function(err){  // upload file 
        if(err){
          res.send(err)
        }
        else{
          console.log("file uploaded")
        }
      })
      var start = new Date().getTime(); // xác định thời gian upload file
      var do_alert = function(){  // setTime Out để việc upload hoàn tất.
        // lôi lên và đọc 
        // dẫn từ hosting ra thôi 
        var workbook=XLSX.readFile("src/upload/"+filename);// cả file  đường dẫn từ file mẹ 
        let worksheet=workbook.Sheets[workbook.SheetNames[0]];
      
        // lấy dữ liệu điền vào bảng dethi
        var dethi=[];
        let index=2;
        while(worksheet[`C${index}`]!=null){ // chạy đến khi gặp null
          const CauHoi= worksheet[`C${index}`].v;
          const a = worksheet[`D${index}`].v;
          const b = worksheet[`E${index}`].v;
          const c = worksheet[`F${index}`].v;
          const d = worksheet[`G${index}`].v;
          const dapan = worksheet[`H${index}`].v;
          // rủi ro là thêm số câu thôi 
          const course = worksheet[`A2`].v;  
          const TenBai = worksheet[`B2`].v;
        
          dethi.push({course:course,TenBai:TenBai,CauHoi:CauHoi,a:a,b:b,c:c,d:d,dapan:dapan})
          index=index+1;
        }
        // kiểm tra tất cả thằng dethi xem có thằng nào sai tên bài và tên khóa không ( 2 thằng này là biến toàn cục )
        var z=1;
        for(var i=0;i<dethi.length;i++){
          if(dethi[i].TenBai!=tenbai){z=z+1}
          if(dethi[i].course!=tenkhoa){z=z+1}
        }
        if(z>1){
          res.send("Tên bài hoặc tên đường dẫn không đúng")
        }
        else{
                  // Xóa dữ liệu cũ 
        MongoClient.connect(url, function(err, db) {
          if (err) return next(err);
            var dbo = db.db("F8_education_dev");
            dbo.collection("dethi").deleteMany({ course: tenkhoa,TenBai:tenbai }, function(err, obj) {
             if (err) throw err;
           });
        });
   
        // thêm dữ liệu vào databse 
        MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("F8_education_dev");
         
          dbo.collection("dethi").insertMany(dethi, function(err) {
            if (err) throw err;
            });
          res.redirect('/home');
          });
        }
        }
        var end = new Date().getTime();
        setTimeout(do_alert, end - start+5);
    }




    // get updatevideo => cần tạo biến trung gian để truyền qua các view hoặc dùng slug 
     updatevideo(req,res,next){
     
      // xử lý để loại bỏ các ký tự đặc biệt;
      var texttenkhoa=req.params.data.split("-")
      tenkhoa=texttenkhoa[0];
      if(texttenkhoa.length>1)
      {
        for(var i=1;i<texttenkhoa.length;i++){
          tenkhoa=tenkhoa+texttenkhoa[i]
        }
      }
     
      var texttenbai=req.params.slug.split(":")
      tenbai=texttenbai[0]
      if(texttenbai.length>1)
      {
        for(var i=1;i<texttenbai.length;i++){
          tenbai=tenbai+texttenbai[i]
        }
      }
      
       // config lại đường dẫn cho file luôn 
       MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("F8_education_dev");
        var myquery = { slug: req.params.data,TenBai:req.params.slug };
        var newvalues = { $set: {Image: "/img/"+tenkhoa+tenbai+".mp4" } };
        dbo.collection("detailcourses").updateOne(myquery, newvalues, function(err, res) {
          if (err) throw err;
          console.log("1 document updated");
          db.close();
        });
      });

      res.render('courses/tablecourse/updatevideoform')
    }
    // post
    async storeupdatevideo(req,res,next){
     
      // xóa video cũ 
      if(fs.existsSync('src/public/img/'+tenkhoa+tenbai+'.mp4')) // kiểm tra 1 file có tồn tại hay không nếu có thì xóa 
      { console.log('src/public/img/'+tenkhoa+tenbai+'.mp4')
        fs.unlink('src/public/img/'+tenkhoa+tenbai+'.mp4', function (err) {
         if (err) throw err;
         console.log('File deleted!');
       });}
       else{
         console.log('File không tồn tại!');
       }
       

       if(req.files!=null)// xét điều kiện file phải được up lên 
      {
       // upload video 
       // lưu file vào hệ thống 
      var file=req.files.file;// req.files rất quan trọng 

      file.name=tenkhoa+tenbai+'.mp4';// đổi tên 
      var filename=file.name;
      var start = new Date().getTime(); // xác định thời gian upload file
      file.mv('./src/public/img/'+filename,function(err){  // upload file ; lưu file 
        if(err){
          res.send(err)
        }
        else{
          console.log("file uploaded")
        }
      })
      var end = new Date().getTime();
      var time = end - start;
      console.log(time);
      var do_alert = function(){res.redirect('/home');}
      setTimeout(do_alert, end - start+1); // phòng upload chậm 
    }
      else{
        res.redirect('/home');// xét trường hợp trống
      }
    }
    

    async quanlytruycap(req,res,next){
      
      //lấy thông tin bảng quản lý truy cập và gen ra 
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("F8_education_dev");
        dbo.collection("quanlytruycap").find({}).toArray(function(err, result) {
          if (err) throw err;
          res.render('quanlytruycap',{result:result})
        });
      });
    }
}
module.exports=new HomeController; // export ra thằng controller
// để sau này còn import : require
//const newController=require('./NewsController');