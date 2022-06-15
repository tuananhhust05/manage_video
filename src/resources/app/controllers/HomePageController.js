
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


class HomePageController{

     index(req,res,next){
        
        MongoClient.connect(url, function(err, db) {
         if (err) return next(err);
         var dbo = db.db("F8_education_dev");
         
         //ghi dữ liệu truy câp 
          var today = new Date();
          var time= today.getDate()+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
          var myobj=new Object();
          myobj.Time=String(time);
          myobj.taikhoan="0";
          myobj.khoahoc="0";
         dbo.collection("quanlytruycap").insertOne(myobj, function(err, result) {
            if (err) throw err;
          });
       });
        res.render('homepage',{layout: 'homepage' });  // set home page 
     }

      // login 
     // Get 
     login(req,res,next){
      res.render('login',{layout: 'homepage' });  // set home page 
   }
     // post
     storelogin(req,res,next){
      MongoClient.connect(url, function(err, db) {
         if (err) return next(err);
         var dbo = db.db("F8_education_dev");
        
         dbo.collection("tkuser").findOne({email:req.body.email}, function(err, result) {
            if (err) throw err;
            if(result!=null){ // so sánh với null 

               console.log("Đăng nhập thành công");
               res.redirect('/tkuser/'+req.body.email); 
            }
            else{  // ghi vào nếu không bằng 
               console.log("Đăng nhập thất bại ");
               res.redirect('/');   // phải để ngang vế không không được 
            }
          });
       });
        // để ra ngoài tránh bị ghi đè bên trong ; trả thẳng về page chính
       
         
       
   }




    
    // register 
    // get 
    register(req,res,next){
      res.render('register',{layout: 'homepage' });  // set home page 
   }
    //post
    storeregister(req,res,next){
      MongoClient.connect(url, function(err, db) {
         if (err) return next(err);
         var dbo = db.db("F8_education_dev");
         
         dbo.collection("tkuser").findOne({email:req.body.email}, function(err, result) {
            if (err) throw err;
            if(result!=null){ // so sánh với null 
               console.log("TK đã tồn tại");
            }
            else{  // ghi vào nếu không bằng ;phần này không dùng data của của thằng result
               dbo.collection("tkuser").insertOne(req.body, function(err) {
                  if (err) throw err;
                  //console.log("Đã thêm tài khoản");
                  db.close();
                });
            };
          });
       });
       res.redirect('/');  // để ra ngoài tránh bị ghi đè bên trong ; trả thẳng về page chính
       
   }


   //Get 
   loginadmin(req,res,next){
      res.render('loginadmin',{layout: 'homepage' });
   }
   storeloginadmin(req,res,next){
      MongoClient.connect(url, function(err, db) {
         if (err) return next(err);
         var dbo = db.db("F8_education_dev");
        
         dbo.collection("loginadmin").findOne({mail:req.body.email}, function(err, result) {
            if (err) throw err;
            if(result!=null){ // so sánh với null 

               console.log("Đăng nhập thành công");
               res.redirect('/home'); 
            }
            else{  // ghi vào nếu không bằng 
               console.log("Đăng nhập thất bại ");
               res.redirect('/');   // phải để ngang vế không không được 
            }
          });
       });
   }
   }

    
     

// nhớ export
module.exports=new HomePageController;