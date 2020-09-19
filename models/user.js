const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
//The path.join() method joins the specified path segments into one path.
const AVATAR_PATH = path.join('/uploads/users/avatars'); //path to file
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    }
}, {
    timestamps: true
});
// There are two options available, destination and filename. They are both functions that determine where the file should be stored.
// destination is used to determine within which folder the uploaded files should be stored. This can also be given as a string (e.g. '/tmp/uploads'). 
// If no destination is given, the operating system's default directory for temporary files is used.
// Note: You are responsible for creating the directory when providing destination as a function. When passing a string, multer will make sure that the directory is created for you.
// filename is used to determine what the file should be named inside the folder. If no filename is given, each file will be given a random name that doesn't include any file extension.
// Note: Multer will not append any file extension for you, your function should return a filename complete with an file extension
var storage = multer.diskStorage({
        destination: function(req, file, cb) { //cb -> callback
            cb(null, path.join(__dirname, '..', AVATAR_PATH));
        },
        filename: function(req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now())
                //The Unix epoch (or Unix time or POSIX time or Unix timestamp) is the number of seconds that have elapsed since January 1, 1970
        }
    })
    //Static methods aren't called on instances of the model. 
    //Instead, they're called on the model itself. These are often 
    //utility functions, such as functions to create or clone objects.

//statics
userSchema.statics.uploadedAvatar = multer({ storage: storage }).single('avatar');
//.single(fieldname)
//Accept a single file with the name fieldname. The single file will be stored in req.file.
userSchema.statics.avatarPath = AVATAR_PATH;
//we need AVATAR_PATH to be publicly available for the User model

const User = mongoose.model('User', userSchema);
module.exports = User;