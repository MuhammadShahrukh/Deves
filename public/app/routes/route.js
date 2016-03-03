angular.module("routes",["ngRoute"])

.config(function($routeProvider, $locationProvider){

   $routeProvider

   .when("/",{
      templateUrl : "app/views/pages/home.html",
      controller : "homeCtrl",
      controllerAs : "home"
   })

   .when("/about",{
      templateUrl : "app/views/pages/about.html",
      controller : "aboutCtrl",
      controllerAs : "about"
   })

   .when("/devs/pub/all",{
      templateUrl : "app/views/pages/devspub.html",
      controller : "devsCtrl",
      controllerAs : "devs"
   })
   .when("/devs/pri/specific",{
      templateUrl : "app/views/pages/devspri.html",
      controller : "devsPriCtrl",
      controllerAs : "devspri"
   })
   .when("/login",{
      templateUrl : "app/views/pages/login.html",
      controller : "mainCtrl",
      controllerAs : "login"
   })
   .when("/signup",{
      templateUrl : "app/views/pages/signup.html",
      controller : "mainCtrl",
      controllerAs : "signup"
   })
   .when("/profile",{
      templateUrl : "app/views/pages/profile.html",
      controller : "profileCtrl",
      controllerAs : "profile"
   })
   .otherwise("/");

   $locationProvider.html5Mode(true);

})
