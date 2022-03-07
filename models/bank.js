var mongoose=                require("mongoose")

   

var bankschema=new mongoose.Schema({
    username:String,
    name:String,
    account_no:String,
    ifsc:String,
    
    
});
bankschema.methods.generateHash= function(account_no){
    return bcrypt.hashSync(account_no,bcrypt.genSaltSync(9));
}

module.exports=mongoose.model("bank",bankschema);