//Main function to update news feed and cache to redis server
'use strict';
require('datejs');
var rssreqest = require('http');
var FeedMe = require('feedme');
var makeSmall = require('./helpers/makeSmall');
var clearTemp = require('./helpers/clearTemp');
var parseJSONitems = require('./helpers/parseJSONitems');
function newsFeed(rssURL) {
  this.dataOBJ;
  this.rssURL = rssURL;
  this.dataReady = false;
}
if(!process.env.REDIS_URL)
{
console.warn("no redis server defined");
newsFeed.prototype.update = function update(dir) {
console.info('INFO: Updating news feed from source...');
var getInfo = () => {
  rssreqest.get(this.rssURL, ror => {
    var parser = new FeedMe(true);
    parser.on('error', d => {
      console.warn('WARN: News feed Not Updated, error reading rss, retrying in 5 seconds');
      this.dataOBJ = {};
      
    });
    parser.on('end', () => {
      this.dataOBJ = parseJSONitems(JSON.stringify(parser.done()));
      clearTemp(dir);
      for (var i = 0; i < this.dataOBJ.length; i++) {
        this.dataOBJ[i]['media:content']['url'] =
          this.dataOBJ[i]['media:content']['url'].split('?')[0] +
          '?quality=.8&format=jpg&height=315';
        makeSmall(this.dataOBJ, dir, i);
      }
      console.info('INFO: News feed updated');
      this.dataReady = true;
      clearInterval(dataLoop);     
    });
    ror.pipe(parser);
  });
}
var dataLoop = setInterval(getInfo, 5000);
getInfo();
};
} else {
newsFeed.prototype.update = function update(dir) {
  this.dataOBJ = {};
  console.info('loading news feed');
  var getInfo = () => {
  var client = require('redis').createClient(process.env.REDIS_URL);
  client.get('timestamp',(err, reply) => {
    var oldTime = Date.parse(reply);
    if (oldTime.add(29).minutes() < Date.parse('now')) {
      rssreqest.get(this.rssURL, ror => {
        var parser = new FeedMe(true);
        parser.on('error', d => {
          client.get('xmlCache',(err, reply) => {
            this.dataOBJ = parseJSONitems(reply);
            clearTemp(dir);
            for (var i = 0; i < this.dataOBJ.length; i++) {
              this.dataOBJ[i]['media:content']['url'] =
                this.dataOBJ[i]['media:content']['url'].split('?')[0] +
                '?quality=.8&format=jpg&height=315';
              makeSmall(this.dataOBJ, dir, i);
            }
            console.warn(
              'WARN: News feed Not Updated, error reading rss, loaded from cache'
            );
            this.dataReady = true;
            client.quit();
          });
        });
        parser.on('end', () => {
          client.set('timestamp', Date.parse('now'));
          client.set('xmlCache', JSON.stringify(parser.done()));
          client.get('xmlCache',(err, reply) => {
            this.dataOBJ = parseJSONitems(reply);
            clearTemp(dir);
            for (var i = 0; i < this.dataOBJ.length; i++) {
              this.dataOBJ[i]['media:content']['url'] =
                this.dataOBJ[i]['media:content']['url'].split('?')[0] +
                '?quality=.8&format=jpg&height=315';
              makeSmall(this.dataOBJ, dir, i);
            }
            console.info('INFO: News feed updated, Cache Updated');
            this.dataReady = true;
            client.quit();
            clearInterval(dataLoop);
          });
        });
        ror.pipe(parser);
      });
    } else {
      client.get('xmlCache',(err, reply) => {
        this.dataOBJ = parseJSONitems(reply);
        clearTemp(dir);
        for (var i = 0; i < this.dataOBJ.length; i++) {
          this.dataOBJ[i]['media:content']['url'] =
            this.dataOBJ[i]['media:content']['url'].split('?')[0] +
            '?quality=.8&format=jpg&height=315';
          makeSmall(this.dataOBJ, dir, i);
        }
        console.info('INFO: News feed loaded from Cache');
        this.dataReady = true;
        client.quit();
        clearInterval(dataLoop);
      });
    }
  });
}
var dataLoop = setInterval(getInfo, 30000);
getInfo();
};
}
module.exports = newsFeed;