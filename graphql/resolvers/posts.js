const { AuthenticationError } = require("apollo-server");
const Post = require("../../models/Post");

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find()
          .populate("owner")
          .sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId).populate("owner");
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    async getUserPost(_, { username }, { user }) {
      if (!user) throw new AuthenticationError("Unathenticated");
      try {
        const posts = await Post.find({ username }).populate("owner").sort({
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
    async createPost(_, { body, images, title, type }, { user, pubsub }) {
      if (!user) throw new AuthenticationError("Unathenticated");
      if (body.trim() === "") {
        throw new Error("Post body must not be empty");
      }
      const newPost = new Post({
        body,
        title,
        type,
        owner: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
        images,
      });

      const savedPost = await newPost.save();

      const returnedPost = await Post.find()
          .populate("owner")
          .sort({ createdAt: -1 });

      pubsub.publish("NEW_POST", {
        newPost: returnedPost,
      });

      return savedPost;
    },
    async editPost(_, { id, body, images, title, type }, { user }) {
      if (!user) throw new AuthenticationError("Unathenticated");
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
      if (!post) {
        throw new Error("This post doesn't exist");
      }

      return post;
    },
    async deletePost(_, { postId }, { user }) {
      if (!user) throw new AuthenticationError("Unathenticated");
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
    likePost: async (_, { postId }, { user }) => {
      if (!user) throw new AuthenticationError("Unathenticated");
      const { username } = user;

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
