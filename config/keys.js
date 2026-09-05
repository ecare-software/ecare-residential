module.exports = {
    // mongoURI :"mongodb://dkennedy881:<password>@cluster0-shard-00-00-3huhr.mongodb.net:27017,cluster0-shard-00-01-3huhr.mongodb.net:27017,cluster0-shard-00-02-3huhr.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority"
    mongoURI :"mongodb://demarcuskennedy:demarcuskennedy@cluster0-shard-00-00-3huhr.mongodb.net:27017,cluster0-shard-00-01-3huhr.mongodb.net:27017,cluster0-shard-00-02-3huhr.mongodb.net:27017/RCS?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority",

    // Used to sign/verify the httpOnly auth cookie (utils/authToken.js).
    // Hardcoded here to match this file's existing pattern - same known
    // issue as mongoURI above, not a new one. Should move to an env var.
    authTokenSecret: "273018023dd8db90e5af06398d97c31a91c150bd17c7d841e74591fc96c581d2"

}