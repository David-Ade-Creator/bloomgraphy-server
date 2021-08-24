const dotenv = require("dotenv");

dotenv.config();

module.exports = {
    MONGODB : process.env.MONGODB,
    SECRET_KEY : process.env.JWT_SECRET,
    ACCESSBUCKETKEY : process.env.ACCESSBUCKETKEY,
    SECRETACCESSBUCKETKEY : process.env.SECRETACCESSBUCKETKEY,
    PORT :  process.env.PORT,
    JWTSECRET : process.env.JWT_SECRET,
}