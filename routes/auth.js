var express=       require("express"),
    router=        express.Router({mergeParams: true}),
    User=          require('../models/user.js'),
    passport=      require("passport"),
    profile=       require("../models/profile.js"),
    order=       require("../models/orders.js"),
    cart=       require("../models/cart.js"),
    async = require('async'),
    crypto = require('crypto'),
    nodemailer = require('nodemailer'),
    FacebookStrategy = require('passport-facebook').Strategy,
    googleStrategy = require('passport-google-oauth').OAuth2Strategy,
    twitterStrategy = require('passport-twitter').Strategy,
    LocalStrategy=           require("passport-local"),
    moment = require('moment-timezone'),
    auth=require("./authkeys.js");
   
   
 
	
passport.use(new FacebookStrategy({
    clientID: auth.facebookAuth.clientID,
    clientSecret: auth.facebookAuth.clientSecret,
    callbackURL: auth.facebookAuth.callbackURL,
    profileFields: auth.facebookAuth.profileFields
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function(){
      User.findOne({'facebook.id':profile.id},function(err,user){
        if(err)
	    				return done(err);
	    			if(user)
	    				return done(null, user);
	    			else {
	    			  // console.log(profile);
	    			  // console.log(profile.photos);
	    				var newUser = new User();
	    				newUser.username=profile.emails[0].value;
	    				newUser.facebook.id = profile.id;
	    				newUser.facebook.token = accessToken;
	    				newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
	    				newUser.facebook.photo = profile.photos[0].value;
	    				newUser.lastVisited=Date.now();
              newUser.visited=Date.now();
              newUser.logintime=0;
              newUser.TimeSpent=0;
	    				console.log(newUser);

	    				newUser.save(function(err){
	    					if(err)
	    						throw err;
	    					return done(null, newUser);
	    				})
	    				
	    			}
      })
    })
  }
));



passport.use(new googleStrategy({
    clientID: auth.googleAuth.clientID,
    clientSecret: auth.googleAuth.clientSecret,
    callbackURL: auth.googleAuth.callbackURL,
    profileFields: auth.googleAuth.profileFields
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function(){
      User.findOne({'google.id':profile.id},function(err,user){
        if(err)
	    				return done(err);
	    			if(user)
	    				return done(null, user);
	    			else {
	    			  // console.log(profile);
	    				var newUser = new User();
	    				newUser.username=profile.emails[0].value;
	    				newUser.google.id = profile.id;
	    				newUser.google.token = accessToken;
	    				newUser.google.name = profile.displayName;
	    				newUser.google.photo = profile.photos[0].value;
	    				newUser.lastVisited=Date.now();
              newUser.visited=Date.now();
              newUser.logintime=0;
              newUser.TimeSpent=0;
	    				console.log(newUser);

	    				newUser.save(function(err){
	    					if(err)
	    						throw err;
	    					return done(null, newUser);
	    				})
	    				
	    			}
      })
    })
  }
));



passport.use(new twitterStrategy({
    consumerKey: auth.twitterAuth.consumerKey,
    consumerSecret: auth.twitterAuth.consumerSecret,
    callbackURL: auth.twitterAuth.callbackURL,
    profileFields: auth.twitterAuth.profileFields,
    includeEmail: true
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function(){
      User.findOne({'twitter.id':profile.id},function(err,user){
        if(err)
	    				return done(err);
	    			if(user)
	    				return done(null, user);
	    			else {
	    			  
	    				var newUser = new User();
	    				
	    				newUser.username=profile.emails[0].value;
	    				newUser.twitter.id = profile.id;
	    				newUser.twitter.token = accessToken;
	    				newUser.twitter.name = profile.displayName;
	    				newUser.twitter.twitter_name = profile.username;
	    				newUser.twitter.photo = profile.photos[0].value;
	    				newUser.twitter.location = profile._json['location'];
	    				newUser.twitter.followers = profile._json['followers_count'];
	    				newUser.lastVisited=Date.now();
              newUser.visited=Date.now();
              newUser.logintime=0;
              newUser.TimeSpent=0;
	    				console.log(newUser);

	    				newUser.save(function(err){
	    					if(err)
	    						throw err;
	    					return done(null, newUser);
	    				})
	    				
	    			}
      })
    })
  }
));





router.get("/register",function(req,res){
    res.render("register.ejs");
});


router.get("/login",function(req,res){
    res.render("login.ejs");
});


router.post("/register",function(req,res){
    User.register(new User({
        username:req.body.username,
        email:req.body.email,
        invite_code:req.body.invite_code,
        logintime:0,
        TimeSpent:0
        
    },profile.create({
        username:req.body.username,
        email:req.body.email,
        fullname:"",
        gender:"",
        mobile:"",
        address:"",
        img:""
    }),cart.create({
        username:req.body.username
    }),order.create({
        username:req.body.username
    })
    
    ),req.body.password,function(err,user){
        if(err)
        {
            
            console.log(err);
            return res.redirect("/register");
        }
       
        passport.authenticate("local")(req,res,function(){
            res.redirect("/");
            
        });
    });
})

router.post("/login",passport.authenticate("local",{
    successRedirect:"/",
    failureRedirect:"/login",
    failureFlash: "Wrong Credentials!",
      successFlash: "Welcome back!"
    
}),function(req,res){
    
  console.log("hi");
});

router.get("/logout",function(req,res){
    User.findOne({username:req.user.username},function(err,user){
      user.logoutTime=Date.now();
      
      
      var timeDiff = Math.abs(user.logoutTime.getTime() - user.visited.getTime())/1000;
      user.TimeSpent=user.TimeSpent+timeDiff;
      user.save();
    })
    req.session.destroy(function(err){
      res.redirect("/");
    })

    
});


router.get('/forgot', function(req, res) {
  res.render('forgot.ejs');
});
router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
          if(err){
              // req.flash("error","Some Error Occured!");
                res.redirect("/");
          }else{
              if (!user) {
          // req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        

        user.save(function(err) {
          done(err, token, user);
        });
          }
        
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        host: 'smtp.mail.yahoo.com',
        port: 465,
        service: 'yahoo', 
        auth: {
          user: 'gdiptesh@yahoo.com',
          pass: 'narutooreki'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'gdiptesh@yahoo.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'https://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        // req.flash('success', 'An e-mail has been sent to ' + user.username + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/');
  });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if(err){
        // req.flash("error","Some Error Occured!");
                res.redirect("/");
    }else{
        if (!user) {
    //   req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset.ejs', {token: req.params.token});
    }
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if(err){
            // req.flash("error","Some Error Occured!");
                res.redirect("/");
        }else{
            if (!user) {
        //   req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          if(err){
              // req.flash("error","Some Error Occured!");
                res.redirect("/");
          }else{
              user.setPassword(req.body.password, function(err) {
            if(err){
                // req.flash("error","Some Error Occured!");
                res.redirect("/");
            }else{
                user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              if(err){
                  // req.flash("error","Some Error Occured!");
                res.redirect("/");
              }else{
                  req.logIn(user, function(err) {
                done(err, user);
              });
              }
            });
            }
          })
          }
        } else {
            // req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        host: 'smtp.mail.yahoo.com',
          port: 465,
        service: 'yahoo', 
        auth: {
          user: 'gdiptesh@yahoo.com',
          pass: 'narutooreki'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'gdiptesh@yahoo.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.username + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        // req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    if(err){
        // req.flash("error","Some Error Occured!");
                res.redirect("/");
    }else{
        res.redirect('/');
    }
  });
});


router.get("/change_pass",function(req,res){
  res.render("change_pass.ejs");
})

router.post("/change_pass",function(req,res){
  User.findOne({username:req.user.username},function(err,founduser){
    if(err){
      console.log(err);
    }else{
      founduser.authenticate(req.body.oldpassword,function(err,model,passwordError){
        if(err){
          console.log(err);
        }
        else if(passwordError){
          res.redirect("/profile");
        }else if(model){
          founduser.setPassword(req.body.password, function(err) {
            if(err){
                // req.flash("error","Some Error Occured!");
                res.redirect("/");
            }else{

            founduser.save(function(err) {
              if(err){
                  // req.flash("error","Some Error Occured!");
                res.redirect("/");
              }else{
                  req.logIn(founduser, function(err) {
                if(err){
                  console.log(err)
                }else{
                  var smtpTransport = nodemailer.createTransport({
        host: 'smtp.mail.yahoo.com',
          port: 465,
        service: 'yahoo', 
        auth: {
          user: 'gdiptesh@yahoo.com',
          pass: 'narutooreki'
        }
      });
      var mailOptions = {
        to: founduser.email,
        from: 'gdiptesh@yahoo.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + founduser.username + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        if(err){
          console.log(err);
        }else{
          // req.flash('success', 'Success! Your password has been changed.');
        res.redirect("/");
        }
        
      });
                  
                }
              });
              }
            });
            }
          })
        }
      })
    }
  })
})
router.get("/fbauth",function(req,res){
  res.render("loginfb.ejs");
})

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),(req,res)=>{
    profile.create({
        username:req.body.username,
        email:req.body.username,
        fullname:"",
        gender:"",
        mobile:"",
        address:"",
        img:""
    }),cart.create({
        username:req.body.username
    }),order.create({
        username:req.body.username
    })
    
    res.redirect("/");
    });
                                      
router.get('/auth/google', passport.authenticate('google',{scope:['profile','email']}));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),(req,res)=>{
    profile.create({
        username:req.body.username,
        email:req.body.username,
        fullname:"",
        gender:"",
        mobile:"",
        address:"",
        img:""
    }),cart.create({
        username:req.body.username
    }),order.create({
        username:req.body.username
    })
    
    res.redirect("/");
    });
                                      
router.get('/auth/twitter', passport.authenticate('twitter',{scope:['profile','email']}));

router.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),(req,res)=>{
    profile.create({
        username:req.body.username,
        email:req.body.username,
        fullname:"",
        gender:"",
        mobile:"",
        address:"",
        img:""
    }),cart.create({
        username:req.body.username
    }),order.create({
        username:req.body.username
    })
    
    res.redirect("/");
    });

module.exports=router;




