const express = require('express');
const router =  express.Router();
const defaultController = require('../controllers/defaultController');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;


router.all('/*', (req, res, next)=>{
    req.app.locals.layout = "default";
    next();
});

router.route('/')
    .get(defaultController.index);

//local strategy
passport.use(new localStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, (req, email, password, done)=>{
    User.findOne({email: email})
        .lean()    
        .then(user =>{
            if(!user){
                return done(null, false, req.flash('error-message', 'Email does not exists'));
            }
            else{
                bcrypt.compare(password, user.password, (err, passwordMatched)=>{
                    if(err){
                        return err;
                    }
                    else{
                       if(!passwordMatched){
                           return done(null, false, req.flash('error-message', 'Incorrect username or password'));

                       } 
                       else{
                           return done(null, user, req.flash('success-message', 'Login successfull'));
                       }
                    }
                });
            }
        });
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(user, done) {
    done(null, user);
});



router.route('/login')
    .get(defaultController.login)
    .post( passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true,
        successFlash: true,
        session: true   
    }), defaultController.loginpost);
router.route('/logout').get(defaultController.logout);
router.route('/register')
    .get(defaultController.registerget)
    .post(defaultController.registerpost);

router.route('/post/:id')
        .get(defaultController.singlePost)
        .post(defaultController.submitComment);


module.exports = router;