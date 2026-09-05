require("dotenv").config();

// Used to sign/verify the httpOnly auth cookie (utils/authToken.js). Read
// from the environment - never hardcode this. If a value is ever committed
// (as one previously was, in this file's history), treat it as burned and
// rotate it: generate a new random value and update AUTH_TOKEN_SECRET
// wherever this app is deployed. See .env.example.
const authTokenSecret = process.env.AUTH_TOKEN_SECRET;
if (!authTokenSecret) {
    throw new Error(
        "AUTH_TOKEN_SECRET environment variable is required (see .env.example). " +
        "Copy .env.example to .env and set a value for local development."
    );
}

module.exports = {
    // mongoURI :"mongodb://dkennedy881:<password>@cluster0-shard-00-00-3huhr.mongodb.net:27017,cluster0-shard-00-01-3huhr.mongodb.net:27017,cluster0-shard-00-02-3huhr.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority"
    mongoURI :"mongodb://demarcuskennedy:demarcuskennedy@cluster0-shard-00-00-3huhr.mongodb.net:27017,cluster0-shard-00-01-3huhr.mongodb.net:27017,cluster0-shard-00-02-3huhr.mongodb.net:27017/RCS?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority",

    authTokenSecret,

}
