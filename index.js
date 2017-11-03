'use strict';
//Dependencies 
var compression = require('compression');
var express = require('express');
var app = express();
var path = require("path");
var bodyParser = require('body-parser');
var FeedMe = require('feedme');
var client = require('redis').createClient(process.env.REDIS_URL);
var http = require('http').Server(app);
var rssreqest = require('http');
var port = process.env.PORT || 8080;
require('datejs');
//Setup
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


//RSS Feed to JSON Parser
app.get('/rssfeed', function(req, res) {

    client.get("timestamp", function(err, reply) {
        var oldTime = Date.parse(reply);

        if (oldTime.add(1).minutes() < Date.parse("now")) {
            rssreqest.get('http://www.vh1.com/news/feed', (ror) => {
                var parser = new FeedMe(true);
                parser.on('error', (d) => {
                    res.set('content-type', 'text/json');
                    res.send({ "error": true });
                });
                parser.on('end', () => {
                    client.set("timestamp", Date.parse("now"));
                    client.set("xmlCache", JSON.stringify(parser.done()));
                    client.get("xmlCache", function(err, reply) {
                        res.set('content-type', 'text/json');
                        res.send(reply);
                    });
                });
                ror.pipe(parser);
            });
        } else {
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