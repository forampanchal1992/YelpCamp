const express = require('express');
const router = express.Router();
const CatchAsync = require('../utlis/catchAsync.js');
const ExpressError = require('../utlis/ExpressError.js');
const Campground = require('../models/campground.js');
const { campgroundSchema } = require('../schemas.js');

const validateCampground = (req,res,next) =>{
    
    const {error} = campgroundSchema.validate(req.body);
    if(error)
    {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else{
        next();
    }
    //console.log(result);
 
}

router.get('/', async(req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
})

router.get('/new', (req,res) => {
    res.render('campgrounds/new')
})

router.post('/', validateCampground, CatchAsync(async(req,res,next) => {
    //if(!req.body.campground)throw new ExpressError('Invalid Data',404);
        const campground = new Campground(req.body.campground);
        await campground.save();
        req.flash('success','Successfully made a new campground!!!');

        //res.redirect('/campgrounds')
        res.redirect(`/campgrounds/${campground._id}`)
    
}))

router.get('/:id', CatchAsync(async(req,res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    // console.log(campground);
    if(!campground){
        req.flash('error','Cannot find CampGround!!!');
       return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
}))

router.get('/:id/edit', CatchAsync(async(req,res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', {campground})
}))

router.put('/:id',validateCampground, CatchAsync(async(req,res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    req.flash('success','Successfully updated campground');
    res.redirect(`/campgrounds/${campground._id}`)
   // res.send("It Worked");
}))

router.delete('/:id', CatchAsync(async(req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted campground');
    
    
    res.redirect('/campgrounds')
}))

module.exports = router;
