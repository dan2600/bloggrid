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
    client.set("timestamp", Date.now());
    client.get("timestamp", function (err, reply) {
    console.log("HI I got"+reply);
});
   
    rssreqest.get('http://www.vh1.com/news/feed', (ror) => {
        var parser = new FeedMe(true);
        parser.on('error', (d) => {
            console.log("RSS Feed read bad! Ugh!");
            res.set('content-type', 'text/json');
            res.send({"error":true});
        });
        parser.on('end', () => {
            res.set('content-type', 'text/json');
            res.send(parser.done());
        });
        ror.pipe(parser);
    });
});

app.get('/*', function(req, res) {
    res.status(404);
    res.send("Error 404");
});

http.listen(port, function() {
    console.log(`listening on ${port}`);
});