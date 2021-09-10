const {AuthenticationError,PubSub} = require("apollo-server");

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

const pubSub = new PubSub();

module.exports = (context) => {
    //context  = {...header}
    let token
    if(context.req && context.req.headers.authorization){
        //Bearer ....
        token = context.req.headers.authorization.split("Bearer ")[1];
    } else if(context.connection && context.connection.context.Authorization){
        token = context.connection.context.Authorization
    }
    console.log("start here",context)
    // if(token){
        try {
            const user = jwt.verify(token, SECRET_KEY);
            return {user, pubSub}
        } catch (error) { 
            throw new AuthenticationError("Invalid/Expired token")
        }
    // }
    throw new Error("Authentication token must be \"Bearer [token]");
}