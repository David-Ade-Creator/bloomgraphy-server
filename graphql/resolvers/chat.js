const { UserInputError, AuthenticationError } = require("apollo-server");
const Message = require("../../models/Message");

const User = require("../../models/User");
const checkAuth = require("../../util/check-auth");

module.exports = {
  Query: {
    getMessages: async (_, { recipient }, context) => {
      const user = checkAuth(context);
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
      const { username } = checkAuth(context);
      const user = await User.findOne({ username }).populate("chatUsers");
      if (!user) {
        throw new UserInputError("User not found");
      }
      const chatUsers = user.chatUsers;
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
      const { username } = checkAuth(context);
      const recipientUser = await User.findOne({ username: recipient });
      if (!recipientUser) {
        throw new UserInputError("User not found");
      }
      const user = await User.findOne({ username });
      if (user) {
        user.chatUsers.push(recipientUser.id);
        const newuser = await user.save();
        const returneduser = await User.findOne({ username }).populate(
          "chatUsers"
        );
        const chatUsers = returneduser.chatUsers;
        return chatUsers;
      }
    },
    sendMessage: async (_, { content, receiver }, context) => {
      const { username } = checkAuth(context);
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

      return message;
    },
  },
};
