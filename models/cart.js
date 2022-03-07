var mongoose=require("mongoose");

var cartschema=mongoose.Schema({
    username:String,
    item:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"item"
        }],
    quantity:[String]
    
});

module.exports=mongoose.model('cart',cartschema);