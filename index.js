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
const config = require('./config');
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
        if (oldTime.add(13).minutes() < Date.parse("now")) {
            rssreqest.get(config.rssURL, (ror) => {
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
                        setTimeout(updateNewsFeed, 120000);
                    });
                });
                parser.on('end', () => {
                    client.set("timestamp", Date.parse("now"));
                    client.set("xmlCache", JSON.stringify(parser.done()));
                    client.get("xmlCache", function(err, reply) {
                        newsJSON = reply;
                        retryCount = 0;
                        console.info("INFO: News feed updated");
                        setTimeout(updateNewsFeed, 900000);
                    });
                });
                ror.pipe(parser);
            });
        } else {
            client.get("xmlCache", function(err, reply) {
                newsJSON = reply;
                console.info("INFO: News feed not updated");
                setTimeout(updateNewsFeed, 900000);
            });
        }
    });
}

updateNewsFeed();

function parseJSONitems(j){
    try{
        var x = JSON.parse(j).items;
    }
    catch(e){
        console.log("Error Reading JSON");
        return "{}";
    }
    return x;
}

app.get('/*', function(req, res) {
    var items = parseJSONitems(newsJSON);
    res.marko(page, {
        items: items,
        pageData: config.pageData
    });
});

http.listen(port, function() {
    console.log(`INFO: listening on ${port}`);
});