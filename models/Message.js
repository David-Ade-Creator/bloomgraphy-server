const {model,Schema} = require("mongoose");

const messageSchema = new Schema({
    content: String,
    createdAt : String,
    sender: String,
    receiver: String,
});

module.exports= model("Message", messageSchema);