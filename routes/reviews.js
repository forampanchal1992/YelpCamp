const express = require('express');
const router = express.Router({mergeParams: true});

const CatchAsync = require('../utlis/catchAsync.js');
const ExpressError = require('../utlis/ExpressError.js');

const Campground = require('../models/campground.js');
const {validateReview, isLoggedIn,isReviewAuthor} = require('../middleware.js');
//const { reviewSchema } = require('../schemas.js');
const Review = require('../models/review.js');



router.post('/',isLoggedIn, validateReview, CatchAsync(async(req,res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Created new Review!!!!')
    res.redirect(`/campgrounds/${campground._id}`)
   // res.send('You Made It')
}))

//delete reviews with the help of Id of campground
// /campground/id/reviews/reviewId
router.delete('/:reviewId',isLoggedIn, isReviewAuthor, CatchAsync(async(req,res) =>{
    //console.log("deleteeee");
   const {id,reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully Deleted!!!');
    res.redirect(`/campgrounds/${id}`);
    //console.log(reviewId);
    //res.send("Delete It");
}))

module.exports = router;