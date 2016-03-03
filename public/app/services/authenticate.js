angular.module("authService",[])

// Authorization Factory
.factory("Auth",function($http, $q, AuthToken){

   authFactory = {};

   authFactory.login = function(email,password){

      return $http.post("/developers/login",{email:email,password:password})
      .success(function(data){
         AuthToken.setToken(data.token);
         return data;
      });
   };
   authFactory.logout = function(){
      AuthToken.setToken();
   };

   authFactory.isLoggedIn = function(){
      if(AuthToken.getToken()) return true;
      else return false;
   };

   authFactory.getProfile = function(){
      if(AuthToken.getToken()){
         return $http.get("/developers/profile");
      }
      else
         return $q.reject({ message: 'User has no token.' });
   };

   return authFactory;

})

// Token Authorization Factory
.factory("AuthToken",function($window){

   var authTokenFactory = {};

   authTokenFactory.setToken = function(token){
      if(token)
         $window.localStorage.setItem("token",token);
      else
         $window.localStorage.removeItem("token");
   };

   authTokenFactory.getToken = function(){
      return $window.localStorage.getItem("token")
   };

   return authTokenFactory;

})

// Every HTTP Request Interceptor Factory
.factory("AuthInterceptor",function($location,$q,AuthToken){

   var interceptorFactory = {};

   interceptorFactory.request = function(config){

      var token = AuthToken.getToken();

      if(token)
         config.headers["x-access-token"] = token;

      return config;
   };


   interceptorFactory.responseError = function(response) {

      // if our server returns a 403 forbidden response
      if (response.status == 403) {
         AuthToken.setToken();
         $location.path('/login');
      }

      // return the errors from the server as a promise

      return $q.reject(response);
   };


   return interceptorFactory;

});
