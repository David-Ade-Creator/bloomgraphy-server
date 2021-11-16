const {model,Schema} = require("mongoose");

const messageSchema = new Schema({
    content: String,
    createdAt : String,
    sender: { type: Schema.Types.ObjectId, ref: 'User'},
    receiver: { type: Schema.Types.ObjectId, ref: 'User'},
});

module.exports= model("Message", messageSchema);