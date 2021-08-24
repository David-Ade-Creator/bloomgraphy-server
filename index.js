const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");

const resolvers = require("./graphql/resolvers");
const typeDefs = require("./graphql/typeDefs");
const { MONGODB,PORT } = require("./config.js");


const pubsub = new PubSub();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => ({req,pubsub})
});

mongoose.connect(MONGODB,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("MongoDb connected")
})

server.listen(PORT).then(res => {
    console.log(`Server running at ${res.url}`)
})