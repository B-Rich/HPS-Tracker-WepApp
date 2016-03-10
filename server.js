var http = require('http');
var express = require('express');
var app = express();

// Mongo General Info
var mongo = require('mongodb');
var uri = 'mongodb://hps-dbuser:!Collab01@ds064628.mlab.com:64628/trackerdb';



// Set up MongoDB connection


// Specify the port
var port = process.env.port || 8080;

// Identify root folder
app.use('/',express.static(__dirname + '/public'));

// MAke it go
app.listen(port);
console.log('Listening on port: ',port);
