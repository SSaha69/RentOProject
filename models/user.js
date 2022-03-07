var mongoose=                require("mongoose"),
    PassportLocalMongoose=   require("passport-local-mongoose")
   

var userschema=new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    invite_code:String,
    item:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"item"
        }],
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    facebook:{
        id: String,
        token: String,
        name: String,
        photo:String,
        email: String
    },
    google:{
        id: String,
        token: String,
        name: String,
        photo:String,
        email: String
    },
    twitter:{
        id: String,
        token: String,
        name: String,
        email: String,
        location:String,
        photo:String,
        followers:String,
        twitter_name:String
    },
    lastVisited:Date,
    visited:Date,
    TimeSpent:Number,
    logoutTime:Date,
    logintime:Number
});

userschema.plugin(PassportLocalMongoose);

module.exports=mongoose.model("user",userschema);