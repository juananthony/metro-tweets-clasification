import mongoose from '../db.js';
import uuid from 'node-uuid';

const TweetSchema = mongoose.Schema({
    id: Number,
    text: String,
    classified: String,
    user: {
        id: Number,
        name: String,
        url: String,
        location: String,
        description: String
    },
    created_at: Date,
    timestamp_ms: Number
});

TweetSchema.set('collection', 'classify');

module.exports = mongoose.model('classify', TweetSchema);
