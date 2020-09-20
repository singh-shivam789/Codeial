const User = require('../models/user');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const passwordMailer = require('../mailers/password_mailer');

module.exports.removeUser = async function(req, res) {
    User.findById(req.params.id, function(err, user) {
        user.remove();
        req.flash('success', 'Account Removed Successfully!');
        return res.redirect('back');
    });
}

module.exports.changePassword = async function(req, res) {

    try {
        if (req.body.new_password != req.body.confirm_password) {
            req.flash('error', 'Passwords do not match!');
            res.redirect('back');
        } else {
            let user = await User.findOne({ 'email': req.body.email });
            user.password = req.body.confirm_password;
            user.save();
            req.flash('success', 'Password successfully changed!');
            return res.redirect('/');
        }
    } catch (error) {
        req.flash('error', error);
        return res.redirect('back');
    }

}

module.exports.resetPasswordRedirect = async function(req, res) {
    try {
        let user = await User.findOne({ 'email': req.body.email });
        // console.log("hello", user);
        // console.log(req.body);
        passwordMailer.newPassword(user);
        req.flash('success', 'Please check your mail for password reset link.');
        return res.redirect('back');
    } catch (error) {
        console.log(error);
        req.flash('error', 'Error!');
        return res.redirect('/');
    }
}

module.exports.resetPassword = async function(req, res) {

    try {
        // console.log(req.body);
        let user = await User.findOne({ 'email': req.body.email });
        return res.render('reset_password', {
            title: 'Reset Password',
            email: user.email
        });
    } catch (error) {
        console.log(error);
        req.flash('error', 'Unauthorized!');
        return res.redirect('/');
    }
}

module.exports.forgotPassword = async function(req, res) {
    try {
        let accessToken = crypto.randomBytes(5).toString('hex');
        return res.render('forgot_password', {
            title: 'Forgot Password?'

        });
    } catch (error) {
        console.log(error);
        req.flash('error', 'Error!');
        return res.redirect('/');
    }

}

module.exports.profile = function(req, res) {
    User.findById(req.params.id, function(err, user) {
        return res.render('user_profile', {
            title: 'User Profile',
            current_user: user
        });
    });
}

module.exports.update = async function(req, res) {
    if (req.user.id == req.params.id) {
        try {
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function(err) {
                if (err) {
                    console.log('****Multer Error', err);
                }
                // console.log(req);
                user.name = req.body.name;
                user.email = req.body.email;
                if (req.file) {
                    if (user.avatar) {
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                        //fs.unlinkSync - delete a name and possibly the file it refers to.
                    }
                    //saving the path of the uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename; //avatarPath is path to avatars folder
                }
                user.save();
                req.flash('success', 'Profile Updated Sucessfully!');
                res.redirect('back');
            });
        } catch (error) {
            req.flash('error', error);
            return res.redirect('back');
        }
    } else {
        req.flash('error', 'Unauthorized!');
        res.status(401).send('Unauthorized');
    }
}

// render the sign up page
module.exports.signUp = function(req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    } else {
        return res.render('user_sign_up', {
            title: "Codeial | Sign Up"
        });
    }
}


// render the sign in page
module.exports.signIn = function(req, res) {

    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}

// get the sign up data
module.exports.create = function(req, res) {
    if (req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    }

    User.findOne({ email: req.body.email }, function(err, user) {
        if (err) { console.log('error in finding user in signing up'); return }

        if (!user) {
            User.create(req.body, function(err, user) {
                if (err) { console.log('error in creating user while signing up'); return }

                return res.redirect('/users/sign-in');
            })
        } else {
            return res.redirect('back');
        }

    });
}


// sign in and create a session for the user
module.exports.createSession = function(req, res) {
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res) {
    req.logout();
    req.flash('success', 'You have logged out!');
    return res.redirect('/');
}