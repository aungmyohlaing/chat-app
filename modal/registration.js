var mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1/zap-chat');
var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));

  
var Schema = mongoose.Schema,
             ObjectId = Schema.ObjectId;


var registrationSchema = new Schema({
   userid: ObjectId, 
   userimage: String,
   displayname: String,
   firstname: String,
   lastname: String,
   email: String,
   password: String,
   confirmpassword: String ,
   salt: String,
   hash: String
});

var Registration = mongoose.model('Registration',registrationSchema);



module.exports = Registration;