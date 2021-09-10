const { AuthenticationError } = require("apollo-server");
const Post = require("../../models/Post");
const checkAuth = require("../../util/check-auth");

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    async getUserPost(_, { username }, context) {
      const {user} = checkAuth(context);
      try {
        const posts = await Post.find({ username: username }).sort({
          createdAt: -1,
        });
        if (posts) {
          return posts;
        } else {
          throw new Error("Post not found");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    async createPost(_, { body, images, title, type }, context) {
      const {user} = checkAuth(context);

      if (body.trim() === "") {
        throw new Error("Post body must not be empty");
      }

      const newPost = new Post({
        body,
        title,
        type,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
        images,
      });

      const post = await newPost.save();

      context.pubsub.publish("NEW_POST", {
        newPost: post,
      });

      return post;
    },
    async editPost(_, { id, body, images, title, type }, context) {
      const { user } = checkAuth(context);
      const {username} = user
      if (body.trim() === "") {
        throw new Error("Post body must not be empty");
      }
      const post = await Post.findByIdAndUpdate(
        id,
        { body, images, title, type },
        {
          new: true,
          runValidators: true,
        }
      );
      if(!post){
        throw new Error("This post doesn't exist");
      }

      return post;
    },
    async deletePost(_, { postId }, context) {
      const {user} = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          return post;
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    likePost: async (_, { postId }, context) => {
      const { user } = checkAuth(context);
      const {username} = user;

      const post = await Post.findById(postId);
      if (post) {
        if (post.likes.find((like) => like.username === username)) {
          //post already liked, unlike it
          post.likes = post.likes.filter((like) => like.username !== username);
        } else {
          //Not liked. like post
          post.likes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }

        await post.save();
        return post;
      } else throw new UserInputError("Post not found");
    },
  },
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("NEW_POST"),
    },
  },
};
