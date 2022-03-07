var mongoose=require("mongoose");

var profileschema=new mongoose.Schema({
    username:String,
    email:String,
    fullname:String,
    gender:String,
    mobile:Number,
    address:String,
    img: String
});

module.exports=mongoose.model("profile",profileschema);