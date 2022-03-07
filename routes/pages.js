var express=     require("express"),
    router=      express.Router(),
    user=        require("../models/user.js"),
    item=        require('../models/items.js'),
    comment=     require("../models/comments.js"),
    profile=     require("../models/profile.js"),
    contact=     require("../models/contact.js"),
    subcats=      require("../models/subcats.js"),
    methodOverride=require("method-override"),
    cart=        require("../models/cart.js"),
    order=        require("../models/orders.js"),
    bank=                    require("../models/bank.js"),
    ObjectId = require('mongodb').ObjectID,
    moment = require('moment-timezone'),
    pdf=require("pdfkit"),
    nodemailer =             require('nodemailer'),
    fs=require("fs")
  
    
  
moment().format();
router.use(methodOverride("_method"));


router.get("/subcat",function(req,res){
    // subcats.create({
    //     name:"electronics",
    //     subcategory:["phone","camera","laptop","speakers"],
    //     brand:["oneplus","sony","nikon","acer","dell","jbl"]
    // },function(err,createditem){
    //     res.send("subcategory created");
    // })


    subcats.create({
        name:"clothings",
        subcategory:["tshirt","sherwani","suit","jeans"],
        brand:["lee cooper","manyavar","djc","turtle","jockey"]
    },function(err){
        subcats.create({
            name:"furnitures",
            subcategory:["chair","table","almirah","shelf"],
            brand:["godrej","nilkamal","ikea","dxracer","jsupreme"]
        },function(err){
            subcats.create({
        name:"vehicles",
        subcategory:["car","bicycle","bus","bike"],
        brand:["hyundai","tata","bmw","ferrari","hero","yamaha"]
    },function(err,createditem){
        res.send("subcategory created");
    })
        })
    })

   
})


router.get("/",function(req,res){
    
    
    item.find({},function(err,founditem){
        if(err){
            console.log(err);
        }else{
            
            res.render("home.ejs",{currentuser:req.user,item:founditem});
            
        }
    })
    
    
});


router.post("/search",function(req,res){
    console.log(req.body.query);
    
    item.find({$and:[{category: { $regex: req.body.category,$options:"i" }},{$or:[{ name: { $regex: req.body.query,$options:"i" }},{ model: { $regex: req.body.query,$options:"i"}}]}]},function(err,foundItem){
        if(err){
            console.log(err);
        }else{
            res.render("search.ejs",{item:foundItem});
        }
    })
    
});

router.get("/new_item",function(req,res){
    res.render("item_desc.ejs");
});

router.get("/profile",function(req,res){
    // profile.findOne({username:req.user.username},function(err,foundProfile){
    //     if(err){
    //         console.log(err)
    //     }else{
            
    //         res.render("profile.ejs",{profile:foundProfile});
    //     }
    // })
    res.render("profile2.ejs");
});

router.post("/profile",function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
},function(req,res){
    profile.findOne({username:req.user.username},function(err,foundProfile){
        if(err){
            console.log(err)
        }else{
            if(req.body.mobile!=null){
                foundProfile.mobile=req.body.mobile;
                
            }
            
            if(req.body.address!=null){
                foundProfile.address=req.body.address;
            }
            
            if(req.body.fullname!=null){
                foundProfile.fullname=req.body.fullname;
            }
            
            if(req.body.gender!=null){
                foundProfile.gender=req.body.gender;
            }
            
            foundProfile.save(function(err,savedProfile){
                if(err){
                    console.log(err);
                }else{
                    req.flash("success","Updated successfully");
                    
            res.redirect("/profile");
                }
            });
                
        }
    })
    
});




router.get("/my_items",function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
},function(req,res){
    
    user.findOne({username:req.user.username}).populate("item").exec(function(err,user){
        if(err){
            console.log(err);
            res.redirect("/");
        }else{
            res.render("my_items.ejs",{item:user.item})
                
            }})
            
        }
        
    
);


router.get("/item/:id",function(req,res){
    
     
    item.findOne({_id:req.params.id}).populate("comment").exec(function(err,founditem){
        if(err){
            console.log(err);
        }else{
            if(req.user==undefined){
                var found=0;
                 item.find({ "_id": { $ne: founditem._id },"category":founditem.category },function(err,relateditem){
                        if(err){
                            console.log(err);
                        }else{
                            console.log(relateditem);
                            res.render("showItem.ejs",{item:founditem,currentuser:req.user,found:found,relitem:relateditem});
                            
                        }
                    })
            }else{
                console.log("hi2");
                cart.findOne({username:req.user.username}).populate("item").exec(function(err,foundcart){
                    
                   
                    
                    
                    
                if(err){
                    
                    console.log(err);
                }else{
                    
                    var index=foundcart.item.indexOf(req.params.id);
                   
                    if(index > -1){
                        var found=1;
                    }else{
                        var found=0;
                    }
                    
                    item.find( { "_id": { $ne: founditem._id },"category":founditem.category },function(err,relateditem){
                        if(err){
                            console.log(err);
                        }else{
                            console.log(relateditem);
                            res.render("showItem.ejs",{item:founditem,currentuser:req.user,found:found,relitem:relateditem,cartitem:foundcart.item,quantity:foundcart.quantity});
                            
                        }
                    })
                    
                    
                    
                   
                }
            })
            }
            
            
        }
    });
});

router.get("/invite",function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
    }
    ,function(req,res){
    res.render("invite.ejs",{currentuser:req.user});
});

router.get("/comments/:id/add",function(req,res){
    
    res.render("create_comments.ejs",{id:req.params.id});
})


router.post("/comments/:id/add",function(req,res){
    req.body.comment.author = req.user.username;
    comment.create(req.body.comment,function(err,comment){
        if(err){
            console.log(err);
        }else{
            console.log(comment);
            item.findOne({_id:req.params.id},function(err,founditem){
                if(err){
                    console.log(err);
                }else{
                    
                   
                    founditem.comment.push(comment);
                    founditem.avg_rating=(((founditem.avg_rating)*founditem.reviewNum)+Number(comment.rating))/(founditem.reviewNum+1);
                    founditem.reviewNum++;
                    founditem.save(function(err,item){
                    if(err){
                        console.log(err);
                    }else{
                        
                        res.redirect("/item/"+req.params.id);
                    }
                });
                    
                }
            })
        }
    })
})

router.get("/my_items/:id/edit",function isAuthorizedItem(req,res,next){
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
    item.findById(req.params.id,function(err,foundItem){
        if(err){
            console.log(err);
        }else{
           
            res.render("editItems.ejs",{item:foundItem});
        }
    })
    
})

// router.put("/my_items/:id/edit",function isAuthorizedItem(req,res,next){
//     item.findOne({_id:req.params.id},function(err,founditem){
//         if(err){
//             console.log(err);
//         }else{
//             if(founditem.username == req.user.username){
//                 return next();
//             }
//             res.redirect("/");
//         }
//     })
// },function(req,res){
//     item.findByIdAndUpdate(req.params.id,req.body.updatedItem,function(err,updateditem){
//         if(err){
//             console.log(err);
//         }else{
//             res.redirect("/item/"+req.params.id);
//         }
//     })
// })

router.delete("/my_items/:id/delete",function isAuthorizedItem(req,res,next){
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
}, function(req,res){
    item.findByIdAndDelete(req.params.id,function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/");
        }
    })
})



router.get("/comments/:id/edit",function isAuthorizedComment(req,res,next){
    comment.findOne({_id:req.params.id},function(err,foundcomment){
        if(err){
            console.log(err);
        }else{
            if(foundcomment.author == req.user.username){
                return next();
            }
            res.redirect("/");
        }
    })
},function(req,res){
    comment.findById(req.params.id,function(err,foundcomment){
        if(err){
            console.log(err);
        }else{
            res.render("edit_comments.ejs",{comment:foundcomment})
        }
    })
    
})


router.put("/comments/:id/edit",function isAuthorizedComment(req,res,next){
    comment.findOne({_id:req.params.id},function(err,foundcomment){
        if(err){
            console.log(err);
        }else{
            if(foundcomment.author == req.user.username){
                return next();
            }
            res.redirect("/");
        }
    })
}, function(req,res){
    comment.findByIdAndUpdate(req.params.id,req.body.updatedcomment,function(err,updatedcomment){
        if(err){
            console.log(err);
        }else{
            res.redirect("/");
        }
    })
})

router.delete("/comments/:id/delete",function isAuthorizedComment(req,res,next){
    comment.findOne({_id:req.params.id},function(err,foundcomment){
        if(err){
            console.log(err);
        }else{
            if(foundcomment.author == req.user.username){
                return next();
            }
            res.redirect("/");
        }
    })
}, function(req,res){
    comment.findByIdAndDelete(req.params.id,function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/");
        }
    })
})

router.get("/categories/:item",function(req,res){
    console.log(req.params.item);
    item.find({category:req.params.item},function(err,founditems){
        if(err){
            console.log(err);
        }else{
            
            res.render("category_items.ejs",{item:founditems});
        }
    })
})

router.post("/cart/:itemid",function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
},function(req,res){
    
    
    
    item.findById(req.params.itemid,function(err,founditem){
        if(err){
            console.log(err);
        }else{
            
            cart.findOne({username:req.user.username},function(err,foundcart){
                if(err){
                    console.log(err);
                }else{
                    var index=foundcart.item.indexOf(req.params.itemid);
                    
                    if (index > -1) {
                        
                    var value=Number(foundcart.quantity[index])+Number(req.body.quantity);
                    if(value<=founditem.days){
                    foundcart.quantity.set(index, value);    
                        
                    
                    
                    foundcart.save(function(err,cart){
                        if(err){
                            console.log(err);
                        }else{
                            console.log(cart);
                             res.redirect("/cart");
                        }
                    });
                }else{
                    res.redirect("/");
                }
                   
                } else {
                    foundcart.item.push(founditem);
                    if(founditem.days>=req.body.quantity){
                    foundcart.quantity.push(req.body.quantity);
                    foundcart.save();
                    res.redirect("/cart");
                    }else{
                        res.redirect("/");
                    }
                    
                    
                    
                }
                    
                    
                    
                    
                    
                    
                }
            })
        }
    })
    
})

router.get("/cart",function(req,res){
    
    cart.findOne({username:req.user.username}).populate("item").exec(function(err,foundcart){
                        if(err){
                            console.log(err);
                        }else{
                            
                            res.render("cartnew.ejs",{cart:foundcart,item:foundcart.item,quantity:foundcart.quantity,currentuser:req.user});
                        }
                    });
    
    
    
})


router.get("/cart/:itemid/remove",function(req,res){
    cart.findOne({username:req.user.username},function(err,foundcart){
        if(err){
            console.log(err);
        }else{
            var index=foundcart.item.indexOf(req.params.itemid)
            foundcart.quantity.pop(index);
            console.log(foundcart);
            foundcart.save();
            
            
             cart.update({username:req.user.username },{ $pull: { item: new ObjectId(req.params.itemid) } },function(err,foundcart){
                 if(err){
                     console.log(err);
                 }else{
                     
                     console.log(foundcart);
                     res.redirect("/cart");
                 }
             })
             
        
             
             
        
        }
    })
})
router.get("/bank_details",function(req,res){
    bank.find({username:req.user.username},function(err,foundbanks){
        if(err){
            console.log(err);
        }else{
            res.render("bank_details.ejs",{bank:foundbanks});
        }
    })
    
})

router.get("/bank_details/add",function(req,res){
    
    res.render("bank_form.ejs");
})


router.post("/bank_details/add",function(req,res){
    var newbank=new bank();
    newbank.username=req.user.username;
    newbank.name=req.body.name;
    newbank.account_no=newbank.generateHash(req.body.account_no);
    newbank.ifsc=req.body.ifsc;
    
    
    newbank.save(function(err,createdbank){
        if(err){
            console.log(err);
        }else{
            
            res.redirect("/bank_details");
        }
    })
})

router.get("/orders/add",function(req,res){
    cart.findOne({username:req.user.username},function(err,foundcart){
                        if(err){
                            console.log(err);
                        }else{
                            order.findOne({username:req.user.username},function(err,foundorder){
                                if(err){
                                    console.log(err);
                                }else{
                            foundorder.item=foundorder.item.concat(foundcart.item);
                            foundorder.quantity=foundorder.quantity.concat(foundcart.quantity);
                            foundorder.save();
                            foundcart.item=[];
                            foundcart.quantity=[];
                            
                            foundcart.save();
                            res.render("order_done.ejs");
                                }
                            })
                            
                            
                        }
                    });
    
})


router.get("/orders",function(req,res){
    order.findOne({username:req.user.username}).populate("item").exec(function(err,foundorder){
                                if(err){
                                    console.log(err);
                                }else{
                                    res.render("orders.ejs",{item:foundorder.item,quantity:foundorder.quantity})
                                }
                            })
})



// router.get("/getpdf",function(req,res){
//     var mydoc=new pdf;

// var writeStream= mydoc.pipe(fs.createWriteStream('node.pdf'));


// mydoc.font('Times-Roman')
// .fontSize(48)
// .text('HEy there',100,100);
// mydoc.end('node.pdf');
// writeStream.on('finish', function () {
//     res.download('./node.pdf');
// });


// })


router.post("/contact",function(req,res){
   
  contact.create({
      email:req.body.email,
      username:req.body.username,
      subject:req.body.subject,
      message:req.body.message
  },function(err,newcontact){
      if(err){
          console.log(err);
      }else{
          
          
          var transporter = nodemailer.createTransport({
             host: 'smtp.mail.yahoo.com',
              port: 465,
             auth: {
                    user: 'gdiptesh@yahoo.com',
                    pass: 'narutooreki'
                }
            });
            
            const mailOptions = {
          from:'gdiptesh@yahoo.com', // sender address
          to: req.body.email, // list of receivers
          subject: 'Recieved a new query', // Subject line
          html: `<p>sender-name : ${req.body.username}
                 <p>sender-email : ${req.body.email}</p>
                 <p>subject : ${req.body.subject}</p>
                 <p>message : ${req.body.message}</p>`// plain text body
        };
          
          transporter.sendMail(mailOptions, function (err, info) {
           if(err)
             console.log(err)
           else
             {
                 
                 console.log("mail sent");
                    var response = {
                    status  : 200,
                }
                
                res.end(JSON.stringify(response));
             }
        });
          
          
          
          
          
          
      }
  })
  
  
});  

router.get("/catitems/:category",function(req,res){
    
    subcats.find({name:req.params.category},function(err,foundsubcat){
        if(err){
            console.log(err);
        }else{
            console.log(foundsubcat[0].subcategory)
             item.find({category:req.params.category}).sort( { avg_rating: -1 } ).exec(function(err,founditems){
            if(err){
                console.log(err);
            }else{
                
                if(req.user==undefined){
                    console.log("hi");
             res.render("category_show.ejs",{subcat:foundsubcat[0].subcategory,brand:foundsubcat[0].brand,currentuser:req.user,item:founditems,cat:req.params.category,category:foundsubcat.name})
                }else{
                    cart.findOne({username:req.user.username}).populate("item").exec(function(err,foundcart){
                    if(err){
                        console.log(err);
                    }else{
                        
                        res.render("category_show.ejs",{subcat:foundsubcat[0].subcategory,brand:foundsubcat[0].brand,cartitem:foundcart.item,currentuser:req.user,quantity:foundcart.quantity,item:founditems,cat:req.params.category,category:foundsubcat.name})
                    }
                })
                }
            }
        })
        }
    })
    

   
   
    
})




router.post("/catitems/:category/filter",function(req,res){
    
     subcats.find({name:req.params.category},function(err,foundsubcat){
            if(req.body.category==undefined && req.body.brand==undefined){
        console.log('both undef')
       
        item.find({$and:[{category:req.params.category},{ price_day: { $gte: req.body.minnum ,$lte: req.body.maxnum } }]},function(err,founditems){
                if(req.body.sort==1){
           
                    founditems.sort(function(a, b){
                        return b.avg_rating-a.avg_rating
                    })
                    }else if(req.body.sort==2){
           
                    founditems.sort(function(a, b){
                        return a.price_day-b.price_day
                    })
                    
                    }else if(req.body.sort==3){
           
                    founditems.sort(function(a, b){
                        return b.price_day-a.price_day
                    })
                    
                    }else{
                        founditems=founditems.slice().reverse()
                    }
       if(req.user==undefined){
                    
                    res.render("category_show.ejs",{subcat:foundsubcat[0].subcategory,brand:foundsubcat[0].brand,currentuser:req.user,item:founditems,cat:req.params.category,category:foundsubcat.name})
             
                }else{
                    cart.findOne({username:req.user.username}).populate("item").exec(function(err,foundcart){
                    if(err){
                        console.log(err);
                    }else{
                        
                        res.render("category_show.ejs",{subcat:foundsubcat[0].subcategory,brand:foundsubcat[0].brand,cartitem:foundcart.item,currentuser:req.user,quantity:foundcart.quantity,item:founditems,cat:req.params.category,category:foundsubcat.name})
                    }
                })
                }
    })
    }else if(req.body.category!=undefined && req.body.brand!=undefined){
        console.log('none undef')
        console.log(req.params.category+" "+req.body.category+" "+req.body.brand)
        item.find({$and:[{category:req.params.category},{ price_day: { $gte: req.body.minnum ,$lte: req.body.maxnum } },{subcategory:req.body.category},{brand:req.body.brand}]},function(err,founditems){
                console.log(founditems)
                if(req.body.sort==1){
           
                    founditems.sort(function(a, b){
                        return b.avg_rating-a.avg_rating
                    })
                    }else if(req.body.sort==2){
           
                    founditems.sort(function(a, b){
                        return a.price_day-b.price_day
                    })
                    
                    }else if(req.body.sort==3){
           
                    founditems.sort(function(a, b){
                        return b.price_day-a.price_day
                    })
                    
                    }else{
                        founditems=founditems.slice().reverse()
                    }
                    
       if(req.user==undefined){
                    
                    res.render("category_show.ejs",{subcat:foundsubcat[0].subcategory,brand:foundsubcat[0].brand,currentuser:req.user,item:founditems,cat:req.params.category,category:foundsubcat.name})
             
                }else{
                    cart.findOne({username:req.user.username}).populate("item").exec(function(err,foundcart){
                    if(err){
                        console.log(err);
                    }else{
                        
                        res.render("category_show.ejs",{subcat:foundsubcat[0].subcategory,brand:foundsubcat[0].brand,cartitem:foundcart.item,currentuser:req.user,quantity:foundcart.quantity,item:founditems,cat:req.params.category,category:foundsubcat.name})
                    }
                })
                }
    })
    }else{
        if(req.body.category==undefined){
            console.log('subcat undef');
             console.log(req.body.brand+" "+req.params.category);
            
        item.find({$and:[{category:req.params.category},{ price_day: { $gte: req.body.minnum ,$lte: req.body.maxnum } },{brand:req.body.brand}]},function(err,founditems){
                if(req.body.sort==1){
           
                    founditems.sort(function(a, b){
                        return b.avg_rating-a.avg_rating
                    })
                    }else if(req.body.sort==2){
           
                    founditems.sort(function(a, b){
                        return a.price_day-b.price_day
                    })
                    
                    }else if(req.body.sort==3){
           
                    founditems.sort(function(a, b){
                        return b.price_day-a.price_day
                    })
                    
                    }else{
                        founditems=founditems.slice().reverse()
                    }
       if(req.user==undefined){
                    
                    res.render("category_show.ejs",{subcat:foundsubcat[0].subcategory,brand:foundsubcat[0].brand,currentuser:req.user,item:founditems,cat:req.params.category,category:foundsubcat.name})
             
                }else{
                    cart.findOne({username:req.user.username}).populate("item").exec(function(err,foundcart){
                    if(err){
                        console.log(err);
                    }else{
                        
                        res.render("category_show.ejs",{subcat:foundsubcat[0].subcategory,brand:foundsubcat[0].brand,cartitem:foundcart.item,currentuser:req.user,quantity:foundcart.quantity,item:founditems,cat:req.params.category,category:foundsubcat.name})
                    }
                })
                }
    })
    }else if(req.body.brand==undefined){
        console.log('brand undef')
        item.find({$and:[{category:req.params.category},{ price_day: { $gte: req.body.minnum ,$lte: req.body.maxnum } },{subcategory:req.body.category}]},function(err,founditems){
                if(req.body.sort==1){
           
                    founditems.sort(function(a, b){
                        return b.avg_rating-a.avg_rating
                    })
                    }else if(req.body.sort==2){
           
                    founditems.sort(function(a, b){
                        return a.price_day-b.price_day
                    })
                    
                    }else if(req.body.sort==3){
           
                    founditems.sort(function(a, b){
                        return b.price_day-a.price_day
                    })
                    
                    }else{
                        founditems=founditems.slice().reverse()
                    }
       if(req.user==undefined){
                    
                    res.render("category_show.ejs",{subcat:foundsubcat[0].subcategory,brand:foundsubcat[0].brand,currentuser:req.user,item:founditems,cat:req.params.category})
             
                }else{
                    cart.findOne({username:req.user.username}).populate("item").exec(function(err,foundcart){
                    if(err){
                        console.log(err);
                    }else{
                        
                        res.render("category_show.ejs",{subcat:foundsubcat[0].subcategory,brand:foundsubcat[0].brand,cartitem:foundcart.item,currentuser:req.user,quantity:foundcart.quantity,item:founditems,cat:req.params.category,category:foundsubcat.name})
                    }
                })
                }
    })
    }
    }
            
        })
        

})
router.get("/cart/:id/:index/:change",function(req,res){
    cart.findOne({_id:req.params.id},function(err,foundcart){
        if(err){
            console.log(err)
        }else{
            console.log(foundcart.quantity[req.params.index],req.params.change)
            if(req.params.change=='up'){
                foundcart.quantity.set(req.params.index, Number(foundcart.quantity[req.params.index])+1)
                
                console.log(foundcart.quantity[req.params.index])
            }else{
                foundcart.quantity.set(req.params.index,Number(foundcart.quantity[req.params.index])-1)
            }
            foundcart.save(function(err,savedcart){
                if(err){
                    console.log(err)
                }else{
                    console.log(savedcart)
                    res.redirect("/cart")
                }
            });
            
        }
    })
})
router.get("/profile2",function(req,res){
    res.render("profile2.ejs")
})

module.exports=router;


