//Main function to update newsfeed and cache to redis server

'use strict';
const config = require('../config');
require('datejs');
var rssreqest = require('http');
var FeedMe = require('feedme');
var makeSmall = require('./makeSmall');
var clearTemp = require('./clearTemp');
var parseJSONitems = require('./parseJSONitems');
var client = require('redis').createClient(process.env.REDIS_URL);

function newsFeed() {
  this.dataOBJ;
  this.dataReady = false;
}

newsFeed.prototype.update = function update(dir) {
  this.dataOBJ = {};
  console.log('loading news feed');
  client.get('timestamp',(err, reply) => {
    var oldTime = Date.parse(reply);
    if (oldTime.add(29).minutes() < Date.parse('now')) {
      rssreqest.get(config.rssURL, ror => {
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
      });
    }
  });
};


module.exports = newsFeed;