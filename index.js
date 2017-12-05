"use strict";
//Dependencies
var compression = require("compression");
require("marko/node-require");
var express = require("express");
var markoExpress = require("marko/express");
var page = require("./page");
var app = express();
var path = require("path");
var FeedMe = require("feedme");
var http = require("http").Server(app);
var rssreqest = require("http");
var secure = require("express-force-https");
var ontime = require("ontime");
var port = process.env.PORT || 8080;
var newsJSON = "";
var retryCount = 0;
const config = require("./config");
require("datejs");

//Setup
app.use(compression());
app.use(express.static(path.join(__dirname, "public"), { maxage: "30d" }));
app.use(markoExpress());
app.use(secure);
app.disable("x-powered-by");
const directory = "./public/images";
var clearTemp = require("./lib/clearTemp");
var makeSmall = require("./lib/makeSmall");
var parseJSONitems = require("./lib/parseJSONitems");
var updateNewsFeed;

if (!process.env.REDIS_URL) {
  console.log("development mode");
  updateNewsFeed = require("./lib/updateNewsFeedNoCache");
  updateNewsFeed(directory, json => {
    newsJSON = json;
  });
} else {
  console.log("production mode");
  updateNewsFeed = require("./lib/updateNewsFeed");
  updateNewsFeed(directory, (json, error) => {
    newsJSON = json;
    if (error) {
      updateNewsFeed(directory, (json, error) => {
        newsJSON = json;
      });
    }
  });
}
ontime(
  {
    cycle: ["00:00"]
  },
  function(ot) {
    console.log("Checking for news feed updates");
    updateNewsFeed(directory, (json, error) => {
      newsJSON = json;
      if (error) {
        console.log("error loading RSS, retrying in 1 minute");
        setTimeout(function() {
          updateNewsFeed(directory, (json, error) => {
            newsJSON = json;
          });
        }, 30000);
      }
    });
    ot.done();
    return;
  }
);

app.get("/*", function(req, res) {
  res.marko(page, {
    items: newsJSON,
    pageData: config.pageData
  });
});

http.listen(port, function() {
  console.log(`INFO: listening on ${port}`);
});
