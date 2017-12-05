const config = require("../config");
require("datejs");
var rssreqest = require("http");
var FeedMe = require("feedme");
var makeSmall = require("./makeSmall");
var clearTemp = require("./clearTemp");
var parseJSONitems = require("./parseJSONitems");
var client = require("redis").createClient(process.env.REDIS_URL);

module.exports = function(dir, callback) {
  var jsonOBJ = {};
  console.log("updating news feed from source...");
  client.get("timestamp", function(err, reply) {
    var oldTime = Date.parse(reply);
    if (oldTime.add(29).minutes() < Date.parse("now")) {
      rssreqest.get(config.rssURL, ror => {
        var parser = new FeedMe(true);
        parser.on("error", d => {
          client.get("xmlCache", function(err, reply) {
            jsonOBJ = parseJSONitems(reply);
            clearTemp(dir);
            for (var i = 0; i < jsonOBJ.length; i++) {
              jsonOBJ[i]["media:content"]["url"] =
                jsonOBJ[i]["media:content"]["url"].split("?")[0] +
                "?quality=.8&format=jpg&height=315";
              makeSmall(jsonOBJ, dir, i);
            }
            console.warn(
              "WARN: News feed Not Updated, error reading rss, loaded from cache"
            );
            callback(dataOBJ, true);
          });
        });
        parser.on("end", () => {
          client.set("timestamp", Date.parse("now"));
          client.set("xmlCache", JSON.stringify(parser.done()));
          client.get("xmlCache", function(err, reply) {
            jsonOBJ = parseJSONitems(reply);
            clearTemp(dir);
            for (var i = 0; i < jsonOBJ.length; i++) {
              jsonOBJ[i]["media:content"]["url"] =
                jsonOBJ[i]["media:content"]["url"].split("?")[0] +
                "?quality=.8&format=jpg&height=315";
              makeSmall(jsonOBJ, dir, i);
            }
            console.info("INFO: News feed updated, Cache Updated");
            callback(jsonOBJ, false);
          });
        });
        ror.pipe(parser);
      });
    } else {
      client.get("xmlCache", function(err, reply) {
        jsonOBJ = parseJSONitems(reply);
        clearTemp(dir);
        for (var i = 0; i < jsonOBJ.length; i++) {
          jsonOBJ[i]["media:content"]["url"] =
            jsonOBJ[i]["media:content"]["url"].split("?")[0] +
            "?quality=.8&format=jpg&height=315";
          makeSmall(jsonOBJ, dir, i);
        }
        console.info("INFO: News feed loaded from Cache");
        callback(jsonOBJ, false);
      });
    }
  });
};
