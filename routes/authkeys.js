module.exports={
    'facebookAuth':{
        'clientID':'404382196969510',
        'clientSecret':'3cf785ef24e6f858a765dc770f96187f',
        'callbackURL':'https://rent-web-ayantaker.c9users.io/auth/facebook/callback',
        'profileFields': ['id', 'email', 'name', 'picture.type(large)','birthday']
    },
    
    'googleAuth':{
        'clientID':'659888403544-m12s6uelk0ppm735r1mkpg1r0iscqiso.apps.googleusercontent.com',
        'clientSecret':'DW7Hrfv5VUYQ2ncmQAdC75dk',
        'callbackURL':'https://rent-web-ayantaker.c9users.io/auth/google/callback',
        'profileFields': ['id', 'email', 'name', 'picture.type(large)']
    },
    'twitterAuth':{
        'consumerKey':'nTDKUxPzxHi0G2l0nBndliqtC',
        'consumerSecret':'gwn3zHAw9j4cmtJhRnsjAtiUNo9ittCkjiyDEAjlGLU9dAMfNC',
        'callbackURL':'https://rent-web-ayantaker.c9users.io/auth/twitter/callback',
        userProfileURL  : 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
        
    }
}