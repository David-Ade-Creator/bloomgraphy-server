const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  createdAt: String,
  firstName: String,
  lastName: String,
  location: String,
  personalWebsite: String,
  portfolioUrl: String,
  bio: String,
  photo: String,
  chatUsers: [{ type: Schema.Types.ObjectId, ref: 'User'}],
});

module.exports = model("User", userSchema);
