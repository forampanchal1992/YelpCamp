const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utlis/catchAsync');
const passport = require('passport');
//for New User Registration
router.get('/register',(req,res)=>{
    res.render('users/register');
});

//just creating new user == register
router.post('/register',catchAsync(async(req,res) => {
    try{    const {email,username,password} = req.body;
    const user = new User({email,username});
    const registeredUser = await User.register(user,password);
   // console.log(registeredUser);
    req.flash('success','Welcome to YelpCamp!!!!');
    res.redirect('/campgrounds');
}catch(e){
    req.flash('error',e.message);
    res.redirect('register')
}
    //res.send(req.body);
}));

//For Login
router.get('/login',(req,res) => {
    res.render('users/login');
});

router.post('/login',passport.authenticate('local',{failureFlash: true, failureRedirect:'/login',successRedirect:'/campgrounds'}),(req,res) => {
    
    req.flash('success','Welcome Back');
    res.redirect('/campgrounds'); 
})

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success',"GoodBye!!!!");
    res.redirect('/campgrounds');
})
module.exports = router;