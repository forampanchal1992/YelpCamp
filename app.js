const express = require('express');
const session = require('express-session')
const flash = require('connect-flash')
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utlis/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

//database connection
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')

//await mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db= mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open", () => {
    console.log("Database Connection")
});

//configuration for App.
app.engine('ejs',ejsMate)
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'))

//middleware setup
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))

//session stuff
const sessionConfig={
    secret: 'thisshouldbeasecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 *60 *24 * 7,
        maxAge: 1000 * 60 *60 *24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
//require('./path/to/passport/config/file')(passport);
passport.use(new LocalStrategy(User.authenticate()));

//how do we store user is the seesion
passport.serializeUser(User.serializeUser());
//how do we get user out of the session
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//how to register a user 
// app.get('/fakeUser',async(req,res) => {
//     const user = new User({email:'coltt@gmail.com',username:'colttt'});
//     const registerU = await User.register(user,'chicken');
//     res.send(registerU);
// })

app.use('/',userRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);

app.get('/', (req,res) => {
    res.render('home')
   // res.send('Hello from yelpCamp!!!!')
})

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