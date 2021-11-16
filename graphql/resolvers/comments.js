const {UserInputError, AuthenticationError} = require("apollo-server")

const Post = require("../../models/Post");

module.exports = {
    Mutation: {
        createComment: async(_, {postId,body}, {user}) => {
            if (!user) throw new AuthenticationError("Unathenticated")

            if(body.trim() === ""){
                throw new UserInputError("Empty comment", {
                    errors: {
                        body: "Comment body must not be empty"
                    }
                })
            }

            const post = await Post.findById(postId);

            if(post){
                post.comments.unshift({
                    body,
                    username:user.username,
                    createdAt: new Date().toISOString()
                })
                await post.save();
                return post;
            } else throw new UserInputError("Post not found");
        },
        deleteComment : async(_, {postId, commentId}, {user}) => {
            if (!user) throw new AuthenticationError("Unathenticated")
            const {username} = user;

            const post = await Post.findById(postId);

            if(post){
                const commentIndex = post.comments.findIndex(c => c.id === commentId);

                if(post.comments[commentIndex].username === username){
                    post.comments.splice(commentIndex, 1);
                    await post.save();
                    return post;
                } else {
                    throw new AuthenticationError("Action not allowed")
                }
            } else {
                throw new UserInputError("Post not found");
            }
        },
       
    }
}