const { UserInputError, AuthenticationError,PubSub, withFilter } = require("apollo-server");
const Message = require("../../models/Message");

const User = require("../../models/User");
const checkAuth = require("../../util/check-auth");

const pubSub = new PubSub();



module.exports = {
  Query: {
    getMessages: async (_, { recipient }, context) => {
      const {user} = checkAuth(context);
      const {username} = user;
      const otherUser = await User.findOne({
        username: recipient,
      });
      if (!otherUser) throw new UserInputError("User not found");

      const usernames = [otherUser.username, user.username];

      const messages = await Message.find({
        receiver: usernames,
        sender: usernames,
      });

      return messages;
    },
    getChatUsers: async (_, { chatUsername }, context) => {
      const {user} = checkAuth(context);
      const {username} = user;
      const _user = await User.findOne({ username }).populate("chatUsers");
      if (!_user) {
        throw new UserInputError("User not found");
      }
      const chatUsers = _user.chatUsers;
      chatUsers.map(async (singleUser) => {
          const usernames = [singleUser.username, username];
          const messages = await Message.find({
            receiver: usernames,
            sender: usernames,
          });
          if(messages){
          const lastMessageBetweenUsers = messages[messages.length - 1];
          singleUser.lastmessage = lastMessageBetweenUsers.content;
          console.log(singleUser.lastmessage);
          }
      });
      return chatUsers;
    },
  },
  Mutation: {
    addChatUser: async (_, { recipient }, context) => {
      const {user} = checkAuth(context);
      const {username} = user;
      const recipientUser = await User.findOne({ username: recipient });
      if (!recipientUser) {
        throw new UserInputError("User not found");
      }
      const _user = await User.findOne({ username });
      if (_user) {
        _user.chatUsers.push(recipientUser.id);
        const newuser = await _user.save();
        const returneduser = await User.findOne({ username }).populate(
          "chatUsers"
        );
        const chatUsers = returneduser.chatUsers;
        return chatUsers;
      }
    },
    sendMessage: async (_, { content, receiver }, context) => {
      const {user} = checkAuth(context);
      const {username} = user;
      if (content.trim() === "") {
        throw new Error("Message must not be empty");
      }

      const newMessage = new Message({
        content,
        receiver,
        sender: username,
        createdAt: new Date().toISOString(),
      });

      
      const message = await newMessage.save();

      pubSub.publish('NEW_MESSAGE', {newMessage: message })
      return message;
    },
  },
  Subscription: {
    newMessage: {
      subscribe : withFilter((_, {}, context) => {
        // const {pubSub} = checkAuth(context);
       return pubSub.asyncIterator(['NEW_MESSAGE'])
      },({newMessage}, {}, context) =>{
        const {user} = checkAuth(context);
        if(newMessage.sender === user.username || newMessage.receiver === user.username ){
          return true;
        }

        return false;
      }),
    }
  }
};
