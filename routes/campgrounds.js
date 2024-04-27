const express = require('express');
const router = express.Router();
const CatchAsync = require('../utlis/catchAsync.js');
const ExpressError = require('../utlis/ExpressError.js');
const Campground = require('../models/campground.js');
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware.js');


router.get('/', async(req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
})

router.get('/new', isLoggedIn,(req,res) => {
  
    res.render('campgrounds/new');
})

router.post('/', isLoggedIn,validateCampground, CatchAsync(async(req,res,next) => {
    //if(!req.body.campground)throw new ExpressError('Invalid Data',404);
        const campground = new Campground(req.body.campground);
        campground.author = req.user._id;
        await campground.save();
        req.flash('success','Successfully made a new campground!!!');

        //res.redirect('/campgrounds')
        res.redirect(`/campgrounds/${campground._id}`)
    
}))

router.get('/:id', CatchAsync(async(req,res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    console.log(campground);
    if(!campground){
        req.flash('error','Cannot find CampGround!!!');
       return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
}))

router.get('/:id/edit',isLoggedIn, isAuthor, CatchAsync(async(req,res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error','Cannot find that campground!!!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground})
}))

//this is for the update routes....
router.put('/:id',isLoggedIn, isAuthor,validateCampground, CatchAsync(async(req,res) => {
    const {id} = req.params;
   
   const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    req.flash('success','Successfully updated campground');
    res.redirect(`/campgrounds/${campground._id}`)
   // res.send("It Worked");
}))

router.delete('/:id',isLoggedIn,isAuthor, CatchAsync(async(req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted campground');
    
    
    res.redirect('/campgrounds')
}))

module.exports = router;
