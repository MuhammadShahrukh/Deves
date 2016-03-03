angular.module("devsService",[])

.factory("Developers",function($http,AuthToken){

   var devsFactory = {};

   // getting all developers for public
   devsFactory.getPubAll = function(){
      return $http.get("/developers/pub/all");
   };
   // getting specific developer for public
   devsFactory.getPubSpecific = function(name){
      return $http.get("/developers/pub/" + name);
   };
   // getting all developers for private
   devsFactory.getPriAll = function(){
      return $http.get("/developers/pri/all");
   };
   // getting specific developer for private
   devsFactory.getPriSpecific = function(_id){
      return $http.get("/developers/pri/" + _id);
   };





   devsFactory.createAcc = function(email,password,name){
      return $http.post("/developers/create",
      {
         email:email,
         password:password,
         name:name,
         interest:"web developer",
         institute:"sir syed university",
         technologies:"--empty--",
         frameworks: "--empty--",
         libraries: "--empty--",
         database: "--empty--",
         profession: "student"
      })
      .success(function(data){
         AuthToken.setToken(data.token);
         return data;
      });
   };



   // all below coding is for logged in user
   devsFactory.getUserProfile = function(_id){
      return $http.get("/developers/userprofile/" + _id);
   };

   // here im using mongodb id , i can also use email
   devsFactory.updateUserProfile = function(_id,dataToUpd){
     return $http.put("/developers/userProfile/" + _id,dataToUpd);
   }

   return devsFactory;

})
