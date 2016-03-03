var express = require("express"),
    bodyParser = require("body-parser"),
    morgan = require("morgan"),
    path = require("path"),
    mongoose = require("mongoose")
    jwt = require("jsonwebtoken");

var config = require("./config.js");

var app = express();

mongoose.connect(config.db);

// mobile authentication middleware to be included here later

app.use(morgan("dev"));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static( path.join(__dirname + "/public") ));


var developersRoute = require("./app/routes/developers.route.js")(express,jwt);
app.use("/developers",developersRoute);



// if any route other than server , then they will be handle by
// angularjs, therefore it is define after server routes
app.get("*",function(req,res){
   res.sendFile(path.join(__dirname + "/public/app/views/index.html"));
});



app.listen(3000,function(){
   console.log("server listening on port : 3000");
});
