import mongoose from '../db.js';
import uuid from 'node-uuid';

const TweetSchema = mongoose.Schema({
    id: Number,
    text: String,
    classified: String
});

TweetSchema.set('collection', 'classify');

module.exports = mongoose.model('classify', TweetSchema);
