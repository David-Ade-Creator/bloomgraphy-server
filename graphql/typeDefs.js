const { gql } = require("apollo-server");

module.exports = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    username: String!
    images: [String]
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
    title: String!
    type: String!
  }
  type Comment {
    id: ID!
    createdAt: String!
    username: String!
    body: String!
  }
  type Like {
    id: ID!
    createdAt: String!
    username: String!
  }
  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    token: String!
    username: String!
    createdAt: String!
  }
  input RegisterInput {
    firstName: String!
    lastName: String!
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type S3Payload {
    signedRequest: String!
    url: String!
  }
  input ProfileInput {
    photo: String
    firstName: String!
    lastName: String!
    location: String
    personalWebsite: String
    portfolioUrl: String
    bio: String
  }
  type Profile {
    id: ID!
    photo: String
    firstName: String!
    lastName: String!
    location: String
    personalWebsite: String
    portfolioUrl: String
    bio: String
  }
  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
    getProfile(username: String!): Profile
    getUserPost(username: String!): [Post]
  }
  type Mutation {
    signS3(filename: String!, filetype: String!): S3Payload!
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(
      body: String!
      images: [String]
      type: String!
      title: String!
    ): Post!
    deletePost(postId: ID!): Post!
    createComment(postId: String!, body: String!): Post!
    deleteComment(postId: String!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
    editProfile(
      photo: String
      firstName: String!
      lastName: String!
      bio: String
      location: String
      personalWebsite: String
      portfolioUrl: String
    ): Profile!
  }
  type Subscription {
    newPost: Post!
  }
`;
