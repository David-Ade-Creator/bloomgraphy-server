const postsResolvers = require("./posts");
const usersResolvers = require("./users");
const commentsResolvers = require("./comments");
const uploadResolvers = require("./upload");
const profileResovers = require("./profile");
const chatUsersResolvers = require("./chat");

module.exports = {
    Post: {
        likeCount: (parent) => parent.likes.length,
        commentCount: (parent) => parent.likes.length
    },
    Query: {
        ...postsResolvers.Query,
        ...profileResovers.Query,
        ...chatUsersResolvers.Query,
    },
   Mutation: {
       ...usersResolvers.Mutation,
       ...postsResolvers.Mutation,
       ...commentsResolvers.Mutation,
       ...uploadResolvers.Mutation,
       ...profileResovers.Mutation,
       ...chatUsersResolvers.Mutation,
   } ,
   Subscription: {
       ...postsResolvers.Subscription,
       ...chatUsersResolvers.Subscription,
   }
}