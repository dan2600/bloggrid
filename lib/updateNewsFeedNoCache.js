const config = require('../config');
var rssreqest = require('http');
var FeedMe = require('feedme');
var makeSmall = require('./makeSmall');
var clearTemp = require('./clearTemp');
var parseJSONitems = require('./parseJSONitems');

module.exports = function(dir, callback) {
        var dataOBJ;
        console.log('updating news feed from source...');
        rssreqest.get(config.rssURL, ror => {
            var parser = new FeedMe(true);
            parser.on('error', d => {
                console.warn('WARN: News feed Not Updated, error reading rss');
                dataOBJ = {};
            });
            parser.on('end', () => {
                dataOBJ = parseJSONitems(JSON.stringify(parser.done()));
                clearTemp(dir);
                for (var i = 0; i < dataOBJ.length; i++) {
                    dataOBJ[i]['media:content']['url'] =
                        dataOBJ[i]['media:content']['url'].split('?')[0] +
                        '?quality=.8&format=jpg&height=315';
                    makeSmall(dataOBJ, dir, i);
                }
                console.log('news feed updated');
                callback(dataOBJ);
            });
            ror.pipe(parser);
        });
}