var mongoose=require("mongoose");

var subactSchema= new mongoose.Schema({
    name:String,
    subcategory:[String],
    brand:[String]
})

module.exports=mongoose.model("subcat",subactSchema)