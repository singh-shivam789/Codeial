const Post = require('../models/post');
const User = require('../models/user');
module.exports.home = async function(req, res) {
    //generic code
    //populate user of each post, 
    //which fetches the user object of each post, 
    //corresponding to the user id
    //     Post.find({})
    //         .populate('user')
    //         .populate({
    //             path: 'comments',
    //             populate: { //populate the user inside the comment
    //                 path: 'user'
    //             }
    //         })
    //         .exec(function(err, posts) {
    //             // finding all the posts and populating the user of each post wrt to user ids
    //             User.find({}, function(err, users) {
    //                 return res.render('home', {
    //                     title: "Codeial | Home",
    //                     posts: posts,
    //                     all_users: users
    //                 });
    //             });
    //         });
    // }
    // code using async await
    //1.
    try {
        let posts = await Post.find({})
            .sort('-createdAt')
            .populate('user')
            .populate({
                path: 'comments',
                populate: {
                    //populate the user inside the comment
                    path: 'user'
                }

            }).populate('likes');
        //2.    
        let users = await User.find({});

        //3.
        return res.render('home', {
            title: "Codeial | Home",
            posts: posts,
            all_users: users
        });

    } catch (error) {
        console.log('Error', error);
        return;
    }
    // module.exports.actionName = function(req, res){}

}