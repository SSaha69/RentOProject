var mongoose=require("mongoose");

var orderschema=mongoose.Schema({
    username:String,
    item:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"item"
        }],
    quantity:[String]
    
});

module.exports=mongoose.model('order',orderschema);