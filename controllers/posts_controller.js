const Post = require('../models/post');
const Like = require('../models/likes');
//const User = require('../models/user');
const Comment = require('../models/comment');

try {
    module.exports.create = async function(req, res) {
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        //need to check if request is an AJAX XHR request

        try {
            if (req.xhr) {
                // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
                post = await post.populate('user', '_id name email avatar').execPopulate();
                // console.log(post);
                // let currentUserID = post.user;
                // let user = await User.findById(currentUserID, {});
                // let userName = user.name;

                return res.status(200).json({ //sending the form data as JSON
                    data: {
                        post: post //sending the newly created post as JSON
                    },
                    message: "Post Created!"
                });
            }
        } catch (error) {
            req.flash('error', err);
            // added this to view the error on console as well
            console.log(err);
            return res.redirect('back');
        }
    }

} catch (err) {
    req.flash('error', err);
    return res.redirect('back');
}

//authorization logic:
//as no one is allowed to delete each other's post
//so we are gonna check if the user who posted and 
//user who will delete the post is same
//id vs _id = 
//id is already converted to string format 
//and _id is raw id or number
//.id means converting the object id to string
module.exports.destroy = async function(req, res) {

    try {

        let post = await Post.findById(req.params.id);

        if (post.user == req.user.id) {
            post.remove();
            //deleteMany deletes all the comments
            //based on the query passed

            //delete the associated likes for the post
            //and all its comment's likes too

            await Like.deleteMany({ likeable: post, onModel: 'Post' });
            //The $in operator is not just "strictly" for querying arrays as that can be done with basically any operator for a singular value.
            await Like.deleteMany({ _id: { $in: post.comments } });

            await Comment.deleteMany({ post: req.params.id }); //req.params.id is the 'id' in the a tag to delete posts
            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        post_id: req.params.id //sending the id of the current(AJAX) post to be deleted via AJAX
                    },
                    message: "Post Deleted"
                });
            }
            req.flash('success', 'Post and Associated comments Removed!');
            return res.redirect('back');
        } else {
            //if the users dont match, we return
            req.flash('error', 'You are not autherized to perform this action!');
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error', err);
        return res.redirect('back');
    }
}