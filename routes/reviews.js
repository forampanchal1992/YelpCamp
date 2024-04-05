const express = require('express');
const router = express.Router({mergeParams: true});

const CatchAsync = require('../utlis/catchAsync.js');
const ExpressError = require('../utlis/ExpressError.js');

const Campground = require('../models/campground.js');
const { reviewSchema } = require('../schemas.js');
const Review = require('../models/review.js');

const validateReview = (req,res,next) =>{
    const {error} = reviewSchema.validate(req.body);
   console.log(error);
    if(error)
    {   //console.log(error)
        const msg = error.details.map(m => m.message).join(',')
        throw new ExpressError(msg,400)
    }
    else{
        next();
    }
}

router.post('/', validateReview, CatchAsync(async(req,res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','created new ReView!!!!1')
    res.redirect(`/campgrounds/${campground._id}`)
   // res.send('You Made It')
}))

//delete reviews with the help of Id of campground
router.delete('/:reviewId', CatchAsync(async(req,res) =>{
    console.log("deleteeee");
   const {id,reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully Deleted!!!');
    res.redirect(`/campgrounds/${id}`);
    //console.log(reviewId);
    //res.send("Delete It");
}))

module.exports = router;