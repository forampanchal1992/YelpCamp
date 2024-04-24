const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utlis/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
//for New User Registration
router.get('/register',(req,res)=>{
    res.render('users/register');
});

//just creating new user == register
router.post('/register',catchAsync(async(req,res,next) => {
    try{   
     const {email,username,password} = req.body;
    const user = new User({email,username});
    const registeredUser = await User.register(user,password);
   //console.log(registeredUser);
   req.login(registeredUser,err => {
    if(err) return next(err);
    req.flash('success','Welcome to YelpCamp!!!!');
    res.redirect('/campgrounds');
   })
    
}catch(e){
    req.flash('error',e.message);
    res.redirect('register');
}
    //res.send(req.body);
}));

//For Login
router.get('/login',(req,res) => {
    res.render('users/login');
});

// use the storeReturnTo middleware to save the returnTo value from session to res.locals
router.post('/login',storeReturnTo,passport.authenticate('local',{failureFlash: true, failureRedirect:'/login'}),(req,res) => {
    // passport.authenticate logs the user in and clears req.session    
    req.flash('success','Welcome Back');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl); 
})

router.get('/logout',(req,res,next)=>{
    req.logout(function(err){
        if(err){
            return next(err);
        }
    
    req.flash('success',"GoodBye!!!!");
    res.redirect('/campgrounds');
    });
})
module.exports = router;