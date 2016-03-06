'use strict';
var appname = '哈哈学车';

var express = require('express');
var serveStatic = require('serve-static');
var proxy = require('express-http-proxy');
var app = express();

// http://expressjs.com/en/advanced/best-practice-performance.html
app.use(serveStatic('public'));

// Proxies
// Jia, you need to change this to something relevant.
app.use('/service', proxy('http://localhost:3000', {
  forwardPath: function(req) {
    return require('url').parse(req.url).path;
  }
}));

// Need to let CF set the port if we're deploying there.
var port = process.env.PORT || 9000;
app.listen(port);
console.log(appname + ' started on port ' + port);