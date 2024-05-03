const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds.js');
const CatchAsync = require('../utlis/catchAsync.js');
const ExpressError = require('../utlis/ExpressError.js');
const Campground = require('../models/campground.js');
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware.js');
const {storage} = require('../cloudinary');
const multer = require('multer');
const upload = multer({storage});

//the code/logic is all written in new file Controller/campgrounds.js

router.route('/')
 .get(CatchAsync(campgrounds.index))
 .post(isLoggedIn, upload.array('image'),validateCampground,CatchAsync(campgrounds.createCampground));
// .post(upload.array('image'),(req,res)=>{
//     console.log({body:req.body, file:req.files});
//     res.send("It worked!!!!");


router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .get(CatchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor,validateCampground, CatchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn,isAuthor, CatchAsync(campgrounds.deleteCampground));

router.get('/:id/edit',isLoggedIn, isAuthor, CatchAsync(campgrounds.renderEditForm));

//this is for the update routes....

module.exports = router;
