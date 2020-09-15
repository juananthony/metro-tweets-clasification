module.exports = {
    server: {
        port: process.env.PORT || process.env.SERVER_PORT
    },
    db: {
        uri: 'mongodb+srv://' + process.env.MONGO_USER + ':' + process.env.MONGO_PASS + '@' + process.env.MONGO_SERVER + '/'
    }
}
