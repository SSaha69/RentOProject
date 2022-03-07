var mongoose=require("mongoose");

var itemSchema=new mongoose.Schema({
    
    name:String,
    brand:String,
    category:String,
    subcategory:String,
    model:String,
    price_day:Number,
    price_week:Number,
    price_month:Number,
    desc:String,
    image:String,
    avg_rating:Number,
    reviewNum:Number,
    comment:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"comment"
        }],
    
    userid:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        },
    username:String,
    days:Number
    
     
       
    
    
});

module.exports=mongoose.model('item',itemSchema);



