const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
//const Joi = require('joi');
const { campgroundSchema } = require('./schemas.js');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const CatchAsync = require('./utlis/catchAsync');
const ExpressError = require('./utlis/ExpressError');


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
//await mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db= mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open", () => {
    console.log("Database Connection")
});

app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'))

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

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

app.get('/', (req,res) => {
    res.render('home')
   // res.send('Hello from yelpCamp!!!!')
})

app.get('/campgrounds', async(req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
})

app.get('/campgrounds/new', (req,res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds', validateCampground, CatchAsync(async(req,res,next) => {
    //if(!req.body.campground)throw new ExpressError('Invalid Data',404);
    
        const campground = new Campground(req.body.campground);
        await campground.save();
        //res.redirect('/campgrounds')
        res.redirect(`/campgrounds/${campground._id}`)
    
}))

app.get('/campgrounds/:id', CatchAsync(async(req,res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', {campground});
}))

app.get('/campgrounds/:id/edit', CatchAsync(async(req,res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', {campground})
}))

app.put('/campgrounds/:id',validateCampground, CatchAsync(async(req,res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
    res.redirect(`/campgrounds/${campground._id}`)
   // res.send("It Worked");
}))

app.delete('/campgrounds/:id', CatchAsync(async(req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')
}))

//This will only run when nothing of them match and response back
app.all('*',(req,res,next) => {
    next(new ExpressError('Page not found',404)); 
})

// app.get('/makecampground', async(req,res) => {
//     const camp = new Campground({title: 'My first app',description: 'Very lengthy course',location: 'Canada'});
//     await camp.save();
//     res.send(camp);
// })

app.use((err,req,res,next) =>{
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'On no its error!!!!'
    res.status(statusCode).render('error',{err});
    //res.send('OOO Error you are here')
})

app.listen(3000, ()=> {
    console.log('Serving on port 3000');
})