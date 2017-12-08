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

//Setup
app.use(compression());
app.use(express.static(path.join(__dirname, 'public'), { maxage: '30d' }));
app.use(markoExpress());
app.use(secure);
app.disable('x-powered-by');
const imgDir = './public/images';

//Build RSS information object
  var newsFeed = require('./lib/updateNewsFeed');
  var theFeed = new newsFeed(config.rssURL);
  theFeed.update(imgDir);

//Schedule Hourly RSS updates
ontime(
  {
    cycle: ['00:00']
  },
  (ot) => {
    console.info('INFO: Checking for news feed updates');
    theFeed.update(imgDir);
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
  console.info('INFO: listening on ' + port);
});
