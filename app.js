var express=                 require('express'),
    app=                     express(),
    bodyParser=              require("body-parser"),
    user=                    require('./models/user.js'),
    profile=                    require('./models/profile.js'),
    item=                    require("./models/items.js"),
    authRoutes=              require('./routes/auth.js'),
    pagesRoutes=              require('./routes/pages.js'),
    mongoose=                require('mongoose'),
    passport=                require("passport"),
    LocalStrategy=           require("passport-local"),
    PassportLocalMongoose=   require("passport-local-mongoose"),
    ExpressSession=          require("express-session"),
    bank=                    require("./models/bank.js"),
    flash=                    require("connect-flash"),
    moment = require('moment-timezone'),
    fs=           require("fs");
    
var   path = require('path'),
      multer  = require('multer')
    
app.use(express.static('./public/'));

var storage = multer.diskStorage({
    destination: './public/uploads/',
    filename:function(req,file,cb){
        cb(null,file.fieldname + '-' + Date.now()+
        path.extname(file.originalname)
        );
    }
})

var upload=multer({
    storage:storage
}).single('image');
    
app.use(bodyParser.urlencoded({extended:true}));


mongoose.connect("mongodb://localhost/rent_web");
//PASSPORT CONFIG.....



app.use(ExpressSession({
    secret:"This is a renting website",
    resave:false,
    saveUninitialized:false,
     
}));

app.use(flash());
app.use(function(req,res,next){
    res.locals.error=req.flash("error"),
    res.locals.success=req.flash("success");
    next();
})


app.use(passport.initialize());
app.use(passport.session());

// passport.serializeUser(user.serializeUser());
// passport.deserializeUser(user.deserializeUser());
passport.serializeUser(function(user, done){
        user.lastVisited = user.visited || moment().utcOffset("+05:30").format();
        user.visited =moment().utcOffset("+05:30").format();
        user.logintime=user.logintime+1;
        console.log("hi");
        console.log(user);
        user.save();
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		user.findById(id, function(err, user){
			done(err, user);
		});
	});
passport.use(new LocalStrategy(user.authenticate()));


//......

app.use(authRoutes);
app.use(pagesRoutes);

port=process.env.PORT || 5000
// app.listen(port,function(){
//     console.log("Server started successfully");
// });

app.listen(port,process.env.IP,function(){
    console.log("Server started successfully");
});


app.post("/upload",(req,res) =>{
    
    profile.findOne({username:req.user.username},function(err,foundProfile){
        if(err){
            console.log(err);
        }else{
            
             upload(req,res,(err) =>{
        if(err){
            console.log(err);
        }else{
            if(foundProfile.img!="")
            {
                
               fs.unlink("public/uploads/"+foundProfile.img,function(err){
            if(err) throw err;

         
        });
                foundProfile.img=req.file.filename;
            }else{
                console.log("hi");
                foundProfile.img=req.file.filename;
            }
            
            
            foundProfile.save();
            res.render("profile.ejs",{profile:foundProfile});
        }
    })
            
            
        }
    })
    
   
        
    
    
    
   
});


app.post("/new_item",function(req,res){
   
   
           upload(req,res,(err) =>{
        if(err){
            console.log(err);
        }else{
            
            item.create({
        name:req.body.name,
        category:req.body.category,
        subcategory:req.body.subcategory,
        brand:req.body.brand,
        model:req.body.model,
        days:req.body.days,
        price_day:req.body.price_day,
        price_week:req.body.price_week,
        price_month:req.body.price_month,
        desc:req.body.desc,
        avg_rating:0,
        reviewNum:0,
        userid: req.user._id,
        username: req.user.username,
        
        
        
    },function(err,item){
        if(err)
        {
            console.log(err);
        }else
        {
           
            
            item.image = req.file.filename;
            item.save();
            console.log(item);
           user.findOne({username:req.user.username},function(err,user){
                if(err)
                {
                   console.log(err);
                }else{
               
                user.item.push(item);
            
                 user.save();
            res.redirect("/");
                
                
                
                }
                
                });
        }
        
    });
            
            
            
        }
    })

        
  
   
    
});



app.put("/my_items/:id/edit",function isAuthorizedItem(req,res,next){
    item.findOne({_id:req.params.id},function(err,founditem){
        if(err){
            console.log(err);
        }else{
            if(founditem.username == req.user.username){
                return next();
            }
            res.redirect("/");
        }
    })
},function(req,res){
   
   
           upload(req,res,(err) =>{
        if(err){
            console.log(err);
        }else{
            
        item.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        category:req.body.category,
        model:req.body.model,
        days:req.body.days,
        price_day:req.body.price_day,
        price_week:req.body.price_week,
        price_month:req.body.price_month,
        desc:req.body.desc,
        userid: req.user._id,
        username: req.user.username,
        
        
        
    },function(err,item){
        if(err)
        {
            console.log(err);
        }else
        {
            
           if(req.file!=undefined){
               
            fs.unlink("public/uploads/"+item.image,function(err){
            if(err) throw err;

         
        });   
               
            item.image = req.file.filename;
           }
            item.save();
            
            res.redirect("/item/"+req.params.id);

        }
        
    });
            
            
            
        }
    })

        
  
   
    
});



app.get("*",function(req,res){
  res.send("Oops!You came to the wrong page!!");
});


// var obj = JSON.parse(msg);










    
    
    
    
    
    
    
    
    
    
    
    
            
