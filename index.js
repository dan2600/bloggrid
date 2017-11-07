'use strict';
//Dependencies 
var compression = require('compression');
require('marko/node-require');
var express = require('express');
var markoExpress = require('marko/express');
var page = require('./page');
var app = express();
var path = require("path");
var bodyParser = require('body-parser');
var FeedMe = require('feedme');
var client = require('redis').createClient(process.env.REDIS_URL);
var http = require('http').Server(app);
var rssreqest = require('http');
var secure = require('express-force-https');
var port = process.env.PORT || 8080;
var newsJSON = "";
var retryCount = 0;
require('datejs');
//Setup
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(markoExpress());
app.use(secure);
app.disable('x-powered-by');

function updateNewsFeed(){
client.get("timestamp", function(err, reply) {
        var oldTime = Date.parse(reply);
        if (oldTime.add(1).hours() < Date.parse("now")) {
            rssreqest.get('http://www.vh1.com/news/feed', (ror) => {
                var parser = new FeedMe(true);
                parser.on('error', (d) => {
                    client.get("xmlCache", function(err, reply) {
                        newsJSON = reply;
                        console.warn("WARN: News feed Not Updated, error reading rss");
                        retryCount++;
                        if(retryCount > 3)
                        {
                            console.error("ERROR: Unable to update news feed after "+retryCount+" attempts");
                        }
                        setTimeout(updateNewsFeed, 300000);
                    });
                });
                parser.on('end', () => {
                    client.set("timestamp", Date.parse("now"));
                    client.set("xmlCache", JSON.stringify(parser.done()));
                    client.get("xmlCache", function(err, reply) {
                        newsJSON = reply;
                        retryCount = 0;
                        console.info("INFO: News feed updated");
                        setTimeout(updateNewsFeed, 1800000);
                    });
                });
                ror.pipe(parser);
            });
        } else {
            client.get("xmlCache", function(err, reply) {
                newsJSON = reply;
                console.info("INFO: News feed not updated");
                setTimeout(updateNewsFeed, 1800000);
            });
        }
    });
}
updateNewsFeed();

app.get('/*', function(req, res) {
    var items = JSON.parse(newsJSON).items;
    res.marko(page, {
        items: items,
    });
});

http.listen(port, function() {
    console.log(`INFO: listening on ${port}`);
});

