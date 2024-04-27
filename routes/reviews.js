const express = require('express');
const router = express.Router({mergeParams: true});
const review = require('../controllers/reviews.js');

const CatchAsync = require('../utlis/catchAsync.js');
const ExpressError = require('../utlis/ExpressError.js');

const Campground = require('../models/campground.js');
const {validateReview, isLoggedIn,isReviewAuthor} = require('../middleware.js');
//const { reviewSchema } = require('../schemas.js');
const Review = require('../models/review.js');



router.post('/',isLoggedIn, validateReview, CatchAsync(review.createReview));

//delete reviews with the help of Id of campground
// /campground/id/reviews/reviewId
router.delete('/:reviewId',isLoggedIn, isReviewAuthor, CatchAsync(review.deleteReview));

module.exports = router;