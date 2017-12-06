//Main File
'use strict';
//Dependencies
var compression = require('compression');
require('marko/node-require');
var express = require('express');
var markoExpress = require('marko/express');
var page = require('./page');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var secure = require('express-force-https');
var ontime = require('ontime');
var port = process.env.PORT || 8080;
const config = require('./config');
var updateNewsFeed;

//Setup
app.use(compression());
app.use(express.static(path.join(__dirname, 'public'), { maxage: '30d' }));
app.use(markoExpress());
app.use(secure);
app.disable('x-powered-by');
const directory = './public/images';
var newsJSON = '';

//Get RSS information
if (!process.env.REDIS_URL) {
  console.log('development mode');
  var newsFeed = require('./lib/updateNewsFeedNoCache');
  var theFeed = new newsFeed;
  theFeed.update(directory);
} else {
  console.log('production mode');
  var newsFeed = require('./lib/updateNewsFeed');
  var theFeed = new newsFeed;
  theFeed.update(directory);
}

//Schedule Hourly RSS updates
ontime(
  {
    cycle: ['00:00']
  },
  function(ot) {
    console.log('Checking for news feed updates');
    theFeed.update(directory);
    ot.done();
    return;
  }
);

//Routes
app.get('/*',(req, res) => {
  res.marko(page, {
    items: theFeed.dataOBJ,
    pageData: config.pageData,
    dataReady: theFeed.dataReady
  });
});

//Server
http.listen(port,() => {
  console.log('INFO: listening on ' + port);
});
