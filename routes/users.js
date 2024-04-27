const express = require('express');
const router = express.Router();
const User = require('../models/user');
const users = require('../controllers/users');
const catchAsync = require('../utlis/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');

//for New User Registration
router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));



//just creating new user == register

//For Login
router.route('/login')
    .get(users.renderLogin)
// use the storeReturnTo middleware to save the returnTo value from session to res.locals
    .post(storeReturnTo,passport.authenticate('local',{failureFlash: true, failureRedirect:'/login'}),users.login);

router.get('/logout',users.logout);
module.exports = router;