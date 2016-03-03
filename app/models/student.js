var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var studentSchema = new Schema({
   // when project complete, rewrite with correct coding

   email : {
      type: String,
      required: true,
      unique : true
   },
   password: {
      type: String,
      required: true,
      select : false
   },

   name : String,
   interest: String,
   institute: String,
   technologies: String,
   frameworks: String,
   libraries : String,
   database: String,
   profession: String

});

module.exports = mongoose.model("Student",studentSchema);
