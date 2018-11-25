import mongoose from 'mongoose';
import config from './config.js';

mongoose.Promise = require('bluebird');

const mongodb_host = config.db.uri;

console.log("host: " + mongodb_host);

mongoose.set("debug", true);
mongoose.connect(mongodb_host, {dbName: 'classification'});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
});

module.exports = mongoose;
