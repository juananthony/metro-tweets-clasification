module.exports = {
    server: {
        port: process.env.SERVER_PORT
    },
    db: {
        //uri: 'mongodb://' + process.env.MONGO_USER + ':' + process.env.MONGO_PASS + '@' + 'Cluster0-shard-0/cluster0-shard-00-00-rxae4.mongodb.net:27017,cluster0-shard-00-01-rxae4.mongodb.net:27017,cluster0-shard-00-02-rxae4.mongodb.net:27017' + '/classification' + 'ssl=true&authSource=admin'
        uri: 'mongodb+srv://' + process.env.MONGO_USER + ':' + process.env.MONGO_PASS + '@' + process.env.MONGO_SERVER + '/'
    }
}
