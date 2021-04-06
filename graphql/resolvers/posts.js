const {AuthenticationError} = require("apollo-server");
const Post = require("../../models/Post");
const checkAuth = require("../../util/check-auth");

module.exports = {
    Query : {
        async getPosts(){
            try {
                const posts = await Post.find().sort({createdAt:-1});
                return posts;
            } catch (error) {
                throw new Error(error);
            }
          },
          async getPost(_, {postId}){
              try {
                  const post = await Post.findById(postId);
                  if(post){
                      return post;
                  } else {
                      throw new Error("Post not found");
                  }
              } catch (error) {
                  throw new Error(error);
              }
          }
      },
      Mutation: {
          async createPost(_, {body, images},context){
              const user = checkAuth(context);
             

              const newPost = new Post({
                  body,
                  user: user.id,
                  username: user.username,
                  createdAt: new Date().toISOString(),
                  images
              });

              const post = await newPost.save();

              return post;
          },
          async deletePost(_, {postId}, context){
              const user = checkAuth(context);

              try{
                  const post = await Post.findById(postId);
                  if(user.username === post.username){
                      await post.delete();
                      return "Post deleted succesfully"
                  }else {
                      throw new AuthenticationError("Action not allowed")
                  }
              } catch (error) {
                  throw new Error(error);
              }
          },
      }
}