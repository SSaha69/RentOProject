var mongoose=require("mongoose");

var commentSchema= new mongoose.Schema({
    author:String,
    rating:String,
    review:String
})

module.exports=mongoose.model("comment",commentSchema)