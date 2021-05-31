const postsResolvers = require("./posts");
const usersResolvers = require("./users");
const commentsResolvers = require("./comments");
const uploadResolvers = require("./upload");
const profileResovers = require("./profile");

module.exports = {
    Post: {
        likeCount: (parent) => parent.likes.length,
        commentCount: (parent) => parent.likes.length
    },
    Query: {
        ...postsResolvers.Query,
        ...profileResovers.Query
    },
   Mutation: {
       ...usersResolvers.Mutation,
       ...postsResolvers.Mutation,
       ...commentsResolvers.Mutation,
       ...uploadResolvers.Mutation,
       ...profileResovers.Mutation,
   } ,
   Subscription: {
       ...postsResolvers.Subscription
   }
}