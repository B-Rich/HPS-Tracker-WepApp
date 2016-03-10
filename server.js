var http = require('http');
var express = require('express');
var app = express();

// Specify the port
var port = process.env.port || 8080;

// Identify root folderapp
app.use('/',express.static(__dirname + '/public'));

// MAke it go
app.listen(port);
console.log('Listening on port: ',port);
