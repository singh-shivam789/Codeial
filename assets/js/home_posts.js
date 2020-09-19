{
    // method to submit the form data for new post using AJAX
    let createPost = function() {
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e) {
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data) {
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));

                    // call the create comment class
                    new PostComments(data.data.post._id);

                    // CHANGE :: enable the functionality of the toggle like button on the newpost
                    new ToggleLike($(' .toggle-like-button', newPost));

                    new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500

                    }).show();

                },
                error: function(error) {
                    console.log(error.responseText);
                }
            });
        });
    }


    // method to create a post in DOM
    let newPostDom = function(post) {
        // CHANGE :: show the count of zero likes on this post
        return $(`<li id="post-${post._id}">
                   
            <div id="post">
            <small id="delete">
                 <a class="delete-post-button"  href="/posts/destroy/${ post._id }">Delete Post</a>
            </small>
           
                <span id="content">
                ${ post.content }
                </span>
                <br>
                <small id="name">
                    ${ post.user.name }
                </small>
                <div id="post-user-img-container">
                    <img style="color:whitesmoke; font-size: small; text-align: center;" src="${post.user.avatar}" alt="${post.user.name}" width="70" height="70">
                </div>

                <!-- CHANGE :: display the likes of this post, if the user is logged in, then show the link to toggle likes, else, just show the count -->
                <br>
                <!-- study about the data attribute -->
                <small>
            
                <a class="toggle-like-button" data-likes="${post.likes.length}" href="/likes/toggle/?id=${post._id}&type=Post">
                        0 Likes
                </a>
            
        </small>

    </div>
    <div class="post-comments">
    <h4>Comments</h4>
        <form class="new-comment-form" id="post-${ post._id }-comments-form" action="/comments/create" method="POST">
            <input id="comment" type="text" name="content" placeholder="Type Here to add comment..." required>
            <input type="hidden" name="post" value="${ post._id }" >
            <input type="submit" value="Add Comment" id="comment-btn">
        </form>


        <div class="post-comments-list">
            <ul id="post-comments-${ post._id }">
                
            </ul>
        </div>
    </div>
                    
                </li>`)
    }


    // method to delete a post from DOM
    let deletePost = function(deleteLink) {
        $(deleteLink).click(function(e) {
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data) {
                    $(`#post-${data.data.post_id}`).remove();
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500

                    }).show();
                },
                error: function(error) {
                    console.log(error.responseText);
                }
            });

        });
    }





    // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
    let convertPostsToAjax = function() {
        $('#posts-list-container>ul>li').each(function() {
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1]
            new PostComments(postId);
        });
    }



    createPost();
    convertPostsToAjax();
}