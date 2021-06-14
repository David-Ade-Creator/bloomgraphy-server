const checkAuth = require("../../util/check-auth");
const User = require("../../models/User");
const { UserInputError } = require("apollo-server-errors");

module.exports = {
  Query: {
    async getProfile(_, { username }, context) {
      const user = checkAuth(context);
      try {
        const profile = await User.findOne({ username: username });
        if (profile) {
          return profile;
        } else throw new UserInputError("Profile not found");
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    async editProfile(_,{
        photo,
        firstName,
        lastName,
        location,
        personalWebsite,
        portfolioUrl,
        bio,
      },context) {
      const user = checkAuth(context);
      try {
        const profile = await User.findOne({ username: user.username });
        if (profile) {
            (profile.photo = photo),
            (profile.firstName = firstName),
            (profile.lastName = lastName),
            (profile.location = location),
            (profile.personalWebsite = personalWebsite),
            (profile.portfolioUrl = portfolioUrl),
            (profile.bio = bio),
            console.log(profile.photo)
            await profile.save();
          return profile;
        } else throw new UserInputError("User not found");
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
