// filter is not complete 
angular.module("filters",[])

  .filter("capsFirstLetter",function(){
    return function(input){

      firstChar = input.charAt(0).toUpperCase();
    //  console.log(firstChar);
      input.slice(0,1);
      for(var i=1; i<input.length; i++){
          if(input.charAt(i) === " "){

          }
      }

      return input;
    }
  });
