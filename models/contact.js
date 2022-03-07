var mongoose=                require("mongoose")
   
   

var contactschema=new mongoose.Schema({
    email:String,
    username:String,
    subject:String,
    message:String
    
});



module.exports=mongoose.model("contact",contactschema);