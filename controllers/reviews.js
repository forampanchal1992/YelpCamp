const Campground = require('../models/campground.js');
const Review = require('../models/review.js');


module.exports.createReview = async(req,res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Created new Review!!!!')
    res.redirect(`/campgrounds/${campground._id}`)
   // res.send('You Made It')
}

module.exports.deleteReview = async(req,res) =>{
    //console.log("deleteeee");
   const {id,reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully Deleted!!!');
    res.redirect(`/campgrounds/${id}`);
    //console.log(reviewId);
    //res.send("Delete It");
}