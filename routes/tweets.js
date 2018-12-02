import express from 'express';
import bodyParser from 'body-parser';
import tweetModel from '../models/tweet';
import tweetClassificationType from '../enums/tweetClassificationType';

const tweetsRouter = express.Router();

const parseUrlEncoded = bodyParser.urlencoded({extended:true});

tweetsRouter.route('/')

    .get((request, response) => {
        console.log("GET /tweets")
        //var query = tweetModel.find({classified: {$exists: false}}).limit(-1).skip(1).next();
        var query = tweetModel.aggregate([
            {
                $match: {classified: {$exists: false}}
            }
            ,{
                $sample: {size: 1}
            }
        ]);
        query.exec((err, tweets) => {
            console.log("received ... " + tweets.length)
            if(tweets !== undefined) {
                response.json(tweets[0]);
            } else {
                response.json('{error: "no tweets left"}');
            }
        })
    });
    
tweetsRouter.route('/:id')
    .get((request, response) => {
        console.log("GET /tweets/" + request.params.id);
        //var query = tweetModel.find({classified: {$exists: false}}).limit(-1).skip(1).next();
        var query = tweetModel.find({_id: request.params.id});
        query.exec((err, tweets) => {
            console.log("received ... " + tweets.length)
            if(tweets !== undefined) {
                response.json(tweets[0]);
            } else {
                response.json('{error: "no tweets left"}');
            }
        })
    })
    .post(bodyParser.json(), (request, response) => {
        console.log("POST /tweets/" + request.body.id);
        console.log(" > body: " + request.body.classified);
        var query = tweetModel.findOneAndUpdate(
            {id: parseInt(request.params.id)}, 
            {$set: {classified: request.body.classified}},
            {new: true},
            (err, tweetObj) => {
                console.log("finished: " + tweetObj)
                if(err) response.status(500).send(err);
                return response.send(tweetObj);
            });
    });

module.exports = tweetsRouter;
