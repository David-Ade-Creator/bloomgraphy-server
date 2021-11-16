const { gql } = require("apollo-server");

module.exports = gql`
  type Post {
    id: ID!
    body: String!
    createdAt: String!
    images: [Image]
    comments: [Comment]!
    likes: [Like]!
    likeCount: Int!
    commentCount: Int!
    title: String!
    type: String!
    owner: User!
    username: String
  }
  type Message {
    id:ID!
    content: String!
    createdAt: String
    sender: User
    receiver: User
  }
  type chatUser {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    username: String!
    lastmessage: String
    photo: String
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
  type Image {
    name: String!
    uid: String!
    url: String!
  }
  type User {
    id: ID!
    photo: String
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
  input ImageInput {
    name: String!
    uid: String!
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
    bio: String,
    username: String
  }
  type Query {
    getPosts: [Post]
    getPost(postId: ID!): Post
    getProfile(username: String!): Profile
    getUserPost(username: String!): [Post]
    getMessages(recipient: String!): [Message]
    getChatUsers:[chatUser]
  }
  type Mutation {
    signS3(filename: String!, filetype: String!): S3Payload!
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(
      body: String!
      images: [ImageInput]
      type: String!
      title: String!
    ): Post!
    editPost(
      id: ID!
      body: String!
      images: [ImageInput]
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
    addChatUser(recipient: String!):[chatUser]
    sendMessage(content:String!,receiverId:String!): Message
  }
  type Subscription {
    newPost: Post!
    newMessage: Message!
    updatedChatUsers: [chatUser]
  }
`;
