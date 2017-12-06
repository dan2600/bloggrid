//Main function to update newsfeed and don't cache for development.
'use strict';
const config = require('../config');
var rssreqest = require('http');
var FeedMe = require('feedme');
var makeSmall = require('./makeSmall');
var clearTemp = require('./clearTemp');
var parseJSONitems = require('./parseJSONitems');

function newsFeed() {
  this.dataOBJ;
  this.dataReady = false;
}

newsFeed.prototype.update = function update(dir) {
  console.log('updating news feed from source...');
var getInfo = () => {
  rssreqest.get(config.rssURL, ror => {
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
      console.log('news feed updated');
      this.dataReady = true;
      clearInterval(dataLoop);     
    });
    ror.pipe(parser);
  });
}
var dataLoop = setInterval(getInfo, 5000);
getInfo();
};

module.exports = newsFeed;