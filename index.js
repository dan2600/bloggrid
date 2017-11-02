'use strict';
//Dependencies 
var compression = require('compression');
var express = require('express');
var app = express();
var path = require("path");
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var request = require('request');
const FeedMe = require('feedme');

//Setup
app.use(compression());
app.use(express.static(path.join(__dirname, "public")));
app.use('/', express.static(path.join(__dirname, "public")));
//app.use(favicon(path.join(__dirname, 'images', 'favicon.ico')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


var http = require('http').Server(app);
var httprq = require('http');
//var io = require('socket.io')(http);
var port = process.env.PORT || 8080;



app.get('/rssfeed', function(req, res) {

    httprq.get('http://www.vh1.com/news/feed/', (ror) => {

        var parser = new FeedMe(true);
        ror.pipe(parser);
        parser.on('end', () => {
            res.set('content-type', 'text/json');
            res.send(parser.done());
        });
    });


});


app.get('/*', function(req, res) {
    res.status(404);
});

http.listen(port, function() {
    console.log(`listening on ${port}`);
});