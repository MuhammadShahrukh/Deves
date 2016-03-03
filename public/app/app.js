angular.module("devs",
["routes","devsService","authService","filters","ngAnimate"])

.config(function($httpProvider){
   $httpProvider.interceptors.push("AuthInterceptor");
})

// main controller
.controller("mainCtrl",function($rootScope,$location,Auth,Developers){
   var vm = this;
   vm.err = null;
   $rootScope.userLogOutData = null;

   vm.loggedIn = Auth.isLoggedIn();

   $rootScope.$on("$routeChangeStart",function(){
      vm.loggedIn = Auth.isLoggedIn();

     if ( vm.loggedIn ) {
    //    console.log("Route Changed")
         Auth.getProfile().success(function(data){
               $rootScope.userLogOutData = data;

         });
      }

   });

   vm.doLogIn = function(){

      // clearing previous error while again logging
      vm.err = "";

      Auth.login(vm.loginData.email,vm.loginData.password)
      .success(function(data){
         if (data.success){
            $rootScope.userLogOutData = data;
            $location.path("/profile");
         }

         else
            vm.err = data.message;

      })
   }

   vm.doLogOut = function() {
      Auth.logout();
      // reset all user info
      vm.loggedIn= Auth.isLoggedIn();
      $rootScope.userLogOutData = {};
      $location.path("/");
   };

   vm.createAccount = function(){
      vm.err = "";
      Developers.createAcc(vm.signUpData.email,vm.signUpData.password,vm.signUpData.name)
      .success(function(data){
         if (data.success)
          $location.path('/profile');
         else
          vm.err = data.message;

      })
   };

})
// home page contoller
.controller("homeCtrl",function(Auth,Developers,$rootScope,$location){
   var vm = this;
   vm.shortDetails = null;
   vm.publicDiv = false;
    $rootScope.specific = null;

   vm.findUser = function(e){
        // when field is empty, backspace moves 1 page back,
        // so to remove that problem below condition is used
        if(vm.name.length === 0 && e.keyCode == 8){
          vm.shortDetails = null;
          vm.publicDiv = false;
          return;
        }

            Developers.getPubSpecific(vm.name)
            .success(function(data){
                vm.shortDetails = data;
            })
   }

   // if some one is logged in it will explore full profile
   // of the one he searched else it will open a new div with
   // small details
  vm.explore = function(){
    if(Auth.isLoggedIn()){
     // console.log("logged in")
     $rootScope.specific = vm.shortDetails._id;
      $location.path("/devs/pri/specific");
    }
    else{
      //console.log("not logged in")
      vm.publicDiv = true;
      //console.log(vm.shortDetails)
    }
  }

  vm.hidePublicDiv = function(){
    //console.log("true");
    vm.publicDiv = false;
    vm.shortDetails = null;
    vm.name = null;
  }

})

// about page controller
.controller("aboutCtrl",function(){
   var vm = this;

})

// devs page controller
.controller("devsCtrl",function($rootScope,Auth,Developers,$location){

  // this controller is used by devs public page

   var vm = this;
   vm.pubDeves = null;
   $rootScope.specific = null;

      // display specific data for public users
      Developers.getPubAll().success(function(data){
        vm.pubDeves = data;
      });

     vm.func = function(speci){
        $rootScope.specific = speci;
     }

})

// devs private page controller
.controller("devsPriCtrl",function(Developers,Auth,$rootScope,$location){
    var vm = this;
    if($rootScope.specific == null && Auth.isLoggedIn()){
      $location.path("/devs/pub/all");
    }
    else{

      Developers.getPriSpecific($rootScope.specific)
      .success(function(data){
        //console.log(data);
        vm.user = data;
      });

    }
})

// login page contoller
.controller("loginCtrl",function(){



})

// Signup page contoller
.controller("signupCtrl",function(){
      var vm = this;

})

.controller("profileCtrl",function(Auth,AuthToken,$location,$rootScope,Developers){
      var vm = this;

      vm.user = null;
      // check if user is logged, then do following things
      if (Auth.isLoggedIn()) {
          // when user navigates on profile page,
         // getting all information of a user from database
         Auth.getProfile().success(function(data){
          //  vm.userProf = data._id;
            Developers.getUserProfile(data._id).success(function(prof){
              // console.log(data._id)
               vm.user = prof;

            })
         });

         // when user updates his profile,
         // updating user information in database
         // and then again fetching new data and updating in view
          vm.submitData = function(){

            Developers.updateUserProfile(vm.user._id, vm.upd,function(){
              // updating Token Again for new name, first removing old token
              if(vm.upd.name && vm.upd.name.length > 0){
                AuthToken.setToken();
            }
            }).
            success(function(data){
              // updating Token Again for new name, now new setting new token
              AuthToken.setToken(data.token);

            });
            vm.upd = {};

            // again fetching updated data
            Developers.getUserProfile(vm.user._id).success(function(prof){
              // console.log(data._id)
               vm.user = prof;
               // updating user Logged info on index page in black box
               $rootScope.userLogOutData = prof;


            })

          };

      }// if condition Ends here

      // if user is not logged in send him to login page
      else{
         $location.path("/login");
      }

});
