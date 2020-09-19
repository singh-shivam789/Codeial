const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const env = require('./environment');
const User = require('../models/user');
const { ExtractJwt } = require('passport-jwt');

let opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.jwt_secret
}

passport.use(new JWTStrategy(opts, function(jwtPayload, done) {
    //payload contains the user info
    //need to find the user based on the info in payload
    User.findById(jwtPayload._id, function(err, user) {
        if (err) {
            console.log("Error in finding user from JWT");
            return;
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));

module.exports = passport;