var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

class CrudController{


    // update khóa học 
    // get 
     ShowUpdateCourse(req,res,next){
     MongoClient.connect(url, function(err, db) {
      if (err) return next(err);
      var dbo = db.db("F8_education_dev");
     dbo.collection("courses").find({slug:req.params.slug}).toArray(function(err, result) { // slug là tên của bảng 
         
       if (err) throw err;
     res.render('courses/update',{result:result})  // đổi tên view thành tên slug 
     db.close();
     });
   });
   }
   // post 
   StoreUpdateCourse(req,res,next){
    MongoClient.connect(url, function(err, db) {
     if (err) return next(err);
     var myquery = { slug: req.body.slug };  // tìm đối tượng có slug như này 
     var newvalues = { $set: req.body }; // set bằng giá trị mới 
   
     var dbo = db.db("F8_education_dev");
    dbo.collection("courses").updateOne(myquery, newvalues, function(err, res) {
        if (err) throw err;
        //console.log("1 document updated");
        db.close();
      });
  });
  res.redirect('/home');
  }
  


  // detecoure 
  DeleteCourse(req,res,next){  // post phải nhận dữ liệu từ form=> làm form 
    MongoClient.connect(url, function(err, db) {
     if (err) return next(err);
     var dbo = db.db("F8_education_dev");

     // delete dữ liệu trong bảng courses 
    dbo.collection("courses").deleteOne({ slug: req.params.slug }, function(err, obj) {
        if (err) throw err;
       
    });
    // xóa đề thi 
    dbo.collection("dethi").deleteMany({ course: req.params.slug }, function(err, obj) {
      if (err) throw err;
      
    });
    // xóa kết quả làm bài 
    dbo.collection("ketquas").deleteMany({ khoahoc: req.params.slug }, function(err, obj) {
      if (err) throw err;
      //db.close();
    });

    // xóa chi tiết khóa học 
    dbo.collection("detailcourses").deleteMany({ slug: req.params.slug }, function(err, obj) {
      if (err) throw err;
      db.close();
    });
   
  });
  res.redirect('/home');
  }

}
module.exports=new CrudController; 