'use strict';
//Dependencies
var compression = require('compression');
require('marko/node-require');
var express = require('express');
var markoExpress = require('marko/express');
var page = require('./page');
var app = express();
const fs = require('fs');
var path = require("path");
var bodyParser = require('body-parser');
var FeedMe = require('feedme');
var http = require('http').Server(app);
var rssreqest = require('http');
var secure = require('express-force-https');
var port = process.env.PORT || 8080;
var newsJSON = "";
var retryCount = 0;
const config = require('./config').config;
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
const directory = './public/images';
var Jimp = require("jimp");

function clearTemp(){
    fs.readdir(directory, (err, files) => {
  if (err) throw err;

  for (const file of files) {
    fs.unlink(path.join(directory, file), err => {
      if (err) throw err;
    });
  }
});
}


function makeSmall(URL, index){
var uniqueFilename = require('unique-filename');
var filename = uniqueFilename('./public/images') + ".jpg";

Jimp.read(URL, function (err, makem) {
    if (err) throw err;
    makem.quality(90)
    .write(filename);
    newsJSON[index]["media:content"]["url"] =  filename.split("public/")[1];
    newsJSON[index].optimized = true;
});
}



if(process.env.NO_REDIS)
{
    console.log("development mode");
    function updateNewsFeed(){
        rssreqest.get(config.rssURL, (ror) => {
                var parser = new FeedMe(true);
                parser.on('error', (d) => {
                    console.warn("WARN: News feed Not Updated, error reading rss");
                    newsJSON = {};
               });
                parser.on('end', () => {
                    newsJSON = parseJSONitems(JSON.stringify(parser.done()));
                    clearTemp();
                    for(var i=0; i < newsJSON.length; i++){
                        newsJSON[i]["media:content"]["url"] = newsJSON[i]["media:content"]["url"].split("?")[0]+"?quality=.8&format=jpg&height=315";
                        makeSmall(newsJSON[i]["media:content"]["url"], i);
                    }
                    setTimeout(updateNewsFeed, 120000);
                });
                ror.pipe(parser);
            });
    }

updateNewsFeed();
}
else
{
var client = require('redis').createClient(process.env.REDIS_URL);
function updateNewsFeed(){
client.get("timestamp", function(err, reply) {
        var oldTime = Date.parse(reply);
        if (oldTime.add(13).minutes() < Date.parse("now")) {
            rssreqest.get(config.rssURL, (ror) => {
                var parser = new FeedMe(true);
                parser.on('error', (d) => {
                    client.get("xmlCache", function(err, reply) {
                        newsJSON = parseJSONitems(reply);
                        clearTemp();
                    for(var i=0; i < newsJSON.length; i++){
                        newsJSON[i]["media:content"]["url"] = newsJSON[i]["media:content"]["url"].split("?")[0]+"?quality=.8&format=jpg&height=315";
                        makeSmall(newsJSON[i]["media:content"]["url"], i);
                    }
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
                        newsJSON = parseJSONitems(reply);
                        clearTemp();
                    for(var i=0; i < newsJSON.length; i++){
                        newsJSON[i]["media:content"]["url"] = newsJSON[i]["media:content"]["url"].split("?")[0]+"?quality=.8&format=jpg&height=315";
                        makeSmall(newsJSON[i]["media:content"]["url"], i);
                    }
                        retryCount = 0;
                        console.info("INFO: News feed updated");
                        setTimeout(updateNewsFeed, 900000);
                    });
                });
                ror.pipe(parser);
            });
        } else {
            client.get("xmlCache", function(err, reply) {
                newsJSON = parseJSONitems(reply);
                clearTemp();
                    for(var i=0; i < newsJSON.length; i++){
                        newsJSON[i]["media:content"]["url"] = newsJSON[i]["media:content"]["url"].split("?")[0]+"?quality=.8&format=jpg&height=315";
                        makeSmall(newsJSON[i]["media:content"]["url"], i);
                    }
                console.info("INFO: News feed not updated");
                setTimeout(updateNewsFeed, 900000);
            });
        }
    });
}
updateNewsFeed();
}


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

  if (req.url.indexOf("images/") === 0 || req.url.indexOf("/images/") === 0) {
    res.setHeader("Cache-Control", "public, max-age=2592000");
    res.setHeader("Expires", new Date(Date.now() + 2592000000).toUTCString());
  }
    res.marko(page, {
        items: newsJSON,
        pageData: config.pageData
    });
});

http.listen(port, function() {
    console.log(`INFO: listening on ${port}`);
});