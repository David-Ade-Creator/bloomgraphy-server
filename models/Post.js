const { model, Schema } = require("mongoose");

const postSchema = new Schema({
  body: String,
  createdAt: String,
  type: String,
  title: String,
  username: String,
  comments: [
    {
      body: String,
      username: String,
      createdAt: String,
    },
  ],
  likes: [
    {
      username: String,
      createdAt: String,
    },
  ],
  images: [
    {
      name: String,
      uid: String,
      url: String,
    }
  ],
  owner: { type: Schema.Types.ObjectId, ref: 'User'},
});

module.exports = model("Post", postSchema);
