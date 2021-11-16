const {
  UserInputError,
  AuthenticationError,
  withFilter,
} = require("apollo-server");
const Message = require("../../models/Message");

const User = require("../../models/User");

module.exports = {
  Query: {
    getMessages: async (_, { recipient }, { user }) => {
      if (!user) throw new AuthenticationError("Unathenticated");
      const otherUser = await User.findOne({
        username: recipient,
      });
      if (!otherUser) throw new UserInputError("User not found");

      const ids = [otherUser._id, user.id];

      const messages = await Message.find({
        receiver: ids,
        sender: ids,
      }).populate(["receiver", "sender"]);

      return messages;
    },

    getChatUsers: async (_, __, { user }) => {
      if (!user) throw new AuthenticationError("Unathenticated");
      const { id, username } = user;

      const messages = await Message.find({
        $or: [{ receiver: id }, { sender: id }],
      }).populate(["receiver", "sender"]);

      let chatMembers = [];

      messages.forEach((message) => {
        chatMembers.push(message.sender);
        chatMembers.push(message.receiver);
      });

      chatMembers = chatMembers.filter(
        (singleMember, index, self) =>
          index ===
          self.findIndex(
            (m) =>
              m.username === singleMember.username && m.username !== username
          )
      );

      return chatMembers;
    },
  },
  Mutation: {
    addChatUser: async (_, { recipient }, { user }) => {
      if (!user) throw new AuthenticationError("Unathenticated");
      const { username } = user;
      const recipientUser = await User.findOne({ username: recipient });
      if (!recipientUser) {
        throw new UserInputError("User not found");
      }
      const _user = await User.findOne({ username });
      if (_user) {
        const chatMember = _user.chatUsers.includes(recipientUser.id);
        if (chatMember) {
          const returneduser = await User.findOne({ username }).populate(
            "chatUsers"
          );
          const chatUsers = returneduser.chatUsers;
          return chatUsers;
        } else {
          _user.chatUsers.push(recipientUser.id);
          const newuser = await _user.save();
          const returneduser = await User.findOne({ username }).populate(
            "chatUsers"
          );
          const chatUsers = returneduser.chatUsers;
          return chatUsers;
        }
      }
    },

    sendMessage: async (_, { content, receiverId }, { user, pubsub }) => {
      if (!user) throw new AuthenticationError("Unathenticated");
      const {id,username} = user;
      if (content.trim() === "") {
        throw new Error("Message must not be empty");
      }

      const newMessage = new Message({
        content,
        receiver: receiverId,
        sender: user.id,
        createdAt: new Date().toISOString(),
      });

      const savedMessages = await newMessage.save();

      const returnedMessage = await Message.findOne({
        _id: savedMessages._id,
      }).populate(["receiver", "sender"]);

      // fetch new user list and push to subscription after a message is send
      const messages = await Message.find({
        $or: [{ receiver: id }, { sender: id }],
      }).populate(["receiver", "sender"]);

      let chatMembers = [];

      messages.forEach((message) => {
        chatMembers.push(message.sender);
        chatMembers.push(message.receiver);
      });

      chatMembers = chatMembers.filter(
        (singleMember, index, self) =>
          index ===
          self.findIndex((m) => m.username === singleMember.username)
      );




      pubsub.publish("UPDATED_CHATUSERS", { updatedChatUsers: chatMembers });

      pubsub.publish("NEW_MESSAGE", { newMessage: returnedMessage });

      return returnedMessage;
    },
  },
  Subscription: {
    updatedChatUsers: {
      subscribe: withFilter(
        (_, __, { user, pubsub }) => {
          if (!user) throw new AuthenticationError("Unathenticated");
          return pubsub.asyncIterator(["UPDATED_CHATUSERS"]);
        },
        ( _, __, ___) => {
          return true;
        }
      ),
    },
    newMessage: {
      subscribe: withFilter(
        (_, __, { user, pubsub }) => {
          if (!user) throw new AuthenticationError("Unathenticated");
          return pubsub.asyncIterator(["NEW_MESSAGE"]);
        },
        ({ newMessage }, _, { user }) => {
          if (
            newMessage.sender.username === user.username ||
            newMessage.receiver.username === user.username
          ) {
            return true;
          }

          return false;
        }
      ),
    },
  },
};
