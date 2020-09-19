const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');


// authentication using passport
passport.use(new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true //allow us to set first arg of function to be request obj
    },
    function(req, email, password, done) {
        // find a user and establish the identity
        User.findOne({ email: email }, function(err, user) {
            if (err) {
                req.flash('error', err);
                return done(err);
            }

            if (!user || user.password != password) {
                req.flash('error', 'Invalid Username/Password');
                return done(null, false);
            }

            return done(null, user);
        });
    }


));


// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done) {
    done(null, user.id);
});



// deserializing the user from the key in the cookies
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        if (err) {
            console.log('Error in finding user --> Passport');
            return done(err);
        }

        return done(null, user); //user is saved as an object in the request object as req.user
    });
});


// check if the user is authenticated
passport.checkAuthentication = function(req, res, next) {
    // if the user is signed in, then pass on the request to the next function(controller's action)
    if (req.isAuthenticated()) {
        return next();
    }

    // if the user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next) {
    if (req.isAuthenticated()) {
        // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
        //The first argument of deserializeUser corresponds to the key of the user object that was given to the done function in serializeUser. 
        //So your whole object is retrieved with help of that key. That key here is the user id (key can be any key of the user object i.e. name,email etc). 
        //In deserializeUser that 
        //key is matched with the in memory array / database or any data resource.
        //The fetched object is attached to the request object as req.user
        //to access user data in views
        //res.locals An object that contains response local variables scoped to the request, and therefore available only to the view(s) rendered during that request / response cycle (if any). Otherwise, this property is identical to app.locals.
        // This property is useful for exposing request-level information such as the request path name, authenticated user, user settings, and so on.
        // res.locals.user = req.user;
        res.locals.user = req.user;
    }

    next();
}



module.exports = passport;