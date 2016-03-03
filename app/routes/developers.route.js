var Student = require("../models/student.js");
module.exports = function(express,jwt) {
   var supersecret = "secret";

   developersRoute = express.Router();

   // LogIn or Authenticating a user and sendind a token
   developersRoute.post("/login",function(req,res){

      Student.findOne({email:req.body.email}).
      select("email password name _id").exec(function(err,user){
         //console.log(user);
         if(err) throw err;
         if(!user){
            res.json({
               success: false,
               message: "Email doest not exist"
            });
         }// if(!user) Ends here
         else if(user){
            if(!(user.password === req.body.password)){
               res.json({
                  success: false,
                  message: "Password is incorrect"
               });
            }
            else{
               // if everything is correct make token and send response
               var token = jwt.sign({
                  email: user.email,
                  name: user.name,
                  _id: user._id
               }, supersecret,{expiresIn : 1440} ); // token func Ends here

               // sending token
               res.json({
                  success: true,
                  message: "Enjoy token",
                  token: token
               });
            }
         }// else if(user) Ends here
      });// student.findOne() Ends here

   });
   // login Ends here


   // Creating  a new user account and assigning token
   developersRoute.post("/create",function(req,res){
    //  console.log(req.body);
      var student = new Student(req.body);
      student.save(function(err,data){
         if(err){
            if(err.code == 11000)
               return res.json({sucess:false,message:"Email already Exists"});
            else
               res.send(err);
         }
         else{
            var token = jwt.sign(
              {
                email:req.body.email,
                name:req.body.name,
                _id: data._id
              },
              supersecret,{expiresIn:1440});
            res.json({success:true,message:"Enjoy your token",token:token});
         }
      })
   });
   //creating account ends here


   // Public Routes Start
   /*
      it will show data of all
      developers to public
   */
   developersRoute.get("/pub/all",function(req,res){
      // find name, email, interest, profession, institute
      Student.find({},"name interest profession institute",function(err,data){
         if(err) throw err;
         res.json(data);
      });
   });

   /*
      it will show specific developer
      data to public
   */
   developersRoute.get("/pub/:name",function(req,res){
      // find name, email, interest, profession, institute
      Student.findOne({name:req.params.name},"name interest profession institute",function(err,data){
         if (err) res.json({message:"user not find"});
         res.json(data);
      });
   });


   /*
      This route will authenticate token on every http request which are
      declared below this middleware
   */
   developersRoute.use(function(req,res,next){
      var token = req.body.token || req.param("token") || req.headers["x-access-token"];

      if(token){
         jwt.verify(token,supersecret,function(err,decoded){
            if (err) {
               res.status(403).send(
                  {
                     success : false,
                     message : "failed to authenticate token"
                  }
               ); // res.status().send() end here
            } // if end here

            else{
                  req.decoded = decoded;
                  next();
            } // else end here

         });// jwt.verify() end here
      }// if end here
      else{
         res.status(403).send(
            {
               success : false,
               message: "No Token Provided"
            }
         ); // res.status().send()  end here
      }// else end here

   });
   // authentication middleware End here


   // Private Routes Start
   /*
      it will show all developers data to loggedIn users
   */
   developersRoute.get("/pri/all",function(req,res){
      // find all data
      Student.find({},function(err,data){
            if (err) throw err;
            res.json(data);
      });
   });
   /*
      it will show specific developer data to loggedIn users
   */
   developersRoute.get("/pri/:_id",function(req,res){
      // find all data
      Student.findOne({_id:req.params._id },function(err,data){
         if(err) throw err;
         res.json(data);
      });
   });
   // End

   /*
      getting small info of logged in developer
   */
   developersRoute.get("/profile",function(req,res){
      res.send(req.decoded);
   });

   /*
      getting complete info of logged in user
      to create its profile page
   */
   developersRoute.get("/userprofile/:_id",function(req,res){

      Student.findOne({_id:req.params._id },function(err,data){
         if(err) throw err;
      //   console.log(data);
         res.json(data);
      });
   });


   /*
      updating user info of a logged in user to
      update its profile
   */
   developersRoute.put("/userprofile/:_id",function(req,res){
      
      var body = req.body;
      Student.findOne({_id:req.params._id},function(err,user){

      //  console.log(user);
      for( var key in body){
        for( var k in user.toObject()){
          if(key == k){
            user[k] = body[key];
          }
        }
      }

      user.save(function(err,data){
               if (err) throw err;
              
               // again creating new token for new name 
               else{
                 var token = jwt.sign({
                  email: data.email,
                  name: data.name,
                  _id: data._id
               }, supersecret,{expiresIn : 1440} );

               // sending token
               res.json({
                  success: true,
                  message: "Enjoy token",
                  token: token
               });
               }// token else end here
            });

      });
   });


   return  developersRoute;

};

