const Post = require('../models/post');
const User = require('../models/user');
module.exports.home = async function(req, res) {
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