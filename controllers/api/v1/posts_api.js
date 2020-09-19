const Post = require('../../../models/post');
const Comment = require('../../../models/comment');
module.exports.index = async function(req, res) {
    let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user', ['_id', 'name', 'email', 'createdAt', 'updatedAt'])
        .populate({
            path: 'comments',
            populate: {
                //populate the user inside the comment
                path: 'user',
                select: ['_id', 'name', 'email', 'createdAt', 'updatedAt']
            }
        });

    return res.json(200, {
        message: "List of posts",
        posts: posts
    });
}
module.exports.destroy = async function(req, res) {

    try {

        let post = await Post.findById(req.params.id);
        if (post.user == req.user.id) {
            post.remove();
            await Comment.deleteMany({ post: req.params.id });
            res.json(200, {
                message: 'Post and Associated Comments Deleted Successfully'
            });
        } else {
            res.json(401, {
                message: "You cannot delete this post"
            });
        }

    } catch (err) {
        return res.json(500, {
            message: "Internal Server Error"
        });
    }
}