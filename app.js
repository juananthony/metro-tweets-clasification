import express from 'express';
import config from './config';
import tweets from './routes/tweets';

var app = express()

app.listen(config.server.port, () => {
    console.log("Listening on port " + config.server.port);
});

app.use('/tweets', tweets);

app.use(express.static('public'));
