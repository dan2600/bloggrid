'use strict';
//Dependencies 
var compression = require('compression');
var express = require('express');
var app = express();
var path = require("path");
var bodyParser = require('body-parser');
var FeedMe = require('feedme');
require('datejs');
//Setup
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


var client = require('redis').createClient(process.env.REDIS_URL);
var http = require('http').Server(app);
var rssreqest = require('http');
var port = process.env.PORT || 8080;

//RSS Feed to JSON Parser
app.get('/rssfeed', function(req, res) {

    client.get("timestamp", function(err, reply) {
        var oldTime = Date.parse(reply);
        console.log("old time plus 1 min " + oldTime.add(1).minutes());
        console.log("the time " + Date.parse("now"));
        if (oldTime.add(1).minutes() < Date.parse("now")) {
            console.log("getting new RSS data");
            rssreqest.get('http://www.vh1.com/news/feed', (ror) => {
                var parser = new FeedMe(true);
                parser.on('error', (d) => {
                    console.log("RSS Feed read bad! Ugh!");
                    res.set('content-type', 'text/json');
                    res.send({ "error": true });
                });
                parser.on('end', () => {
                    client.set("timestamp", Date.parse("now"));
                    client.set("xmlCache", JSON.stringify(parser.done()));
                    res.set('content-type', 'text/json');
                    res.send(parser.done());
                });
                ror.pipe(parser);
            });
        } else {
            console.log("sending cached XML");
            client.get("xmlCache", function(err, reply) {
                res.set('content-type', 'text/json');
                res.send(reply);
            });
        }
    });
});



app.get('/*', function(req, res) {
    res.status(404);
    res.send("Error 404");
});

http.listen(port, function() {
    console.log(`listening on ${port}`);
});