var http = require('http');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
// var mongoose = require('mongoose');


// Mongo General Info
var mongodb = require('mongodb');
var uri = 'mongodb://hps-dbuser:!Collab01@ds064628.mlab.com:64628/trackerdb';

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Specify the port
var port = process.env.port || 8080;

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// HERE ARE MY ROUTES ==========================================================

// GET ALL PROJECTS
router.route('/projects')
    .get(function(req,res){
        var d = [];
        mongodb.MongoClient.connect(uri, function(err, db) {
            var projects = db.collection('projects');
            projects.find ().toArray(function(err,docs){
                if(err) throw err;
                res.json(docs);
            });
        });
    });
// GET ALL ISSUES (LIMITED DATA)
router.route('/issues/limited')
    .get(function(req,res){
        var d = [];
        mongodb.MongoClient.connect(uri, function(err, db) {
            var projects = db.collection('issues');
            projects.find ({},{
                    '_id':true,
                    'issueTitle':true,
                    'issueDescription':true,
                    'currentAssignedTo.title':true,
                    'status':true,
                    'type':true,
                    'project:true'
                }).toArray(function(err,docs){
                if(err) throw err;
                res.json(docs);
            });
        });
    });

    // GET ALL ISSUES (ALL DATA)
    router.route('/issues')
        .get(function(req,res){
            var d = [];
            mongodb.MongoClient.connect(uri, function(err, db) {
                var projects = db.collection('issues');
                projects.find ().toArray(function(err,docs){
                    if(err) throw err;
                    res.json(docs);
                });
            });
        });

// SEEDING
router.route('/seeding')
    .post(function(req, res){
        mongodb.MongoClient.connect(uri, function(err, db) {
            if(err) throw err;
            var projects = db.collection('issues');
            var seed = [];
            projects.insert(seed,function(err,result){
                if(err){
                    console.log(err);
                     db.close();
                } else {
                    res.json(result);
                     db.close();
                }
            });
        });
    });
// ADD A PROJECT
    router.route('/projects')
        .post(function(req, res){
            mongodb.MongoClient.connect(uri, function(err, db) {
                if(err) throw err;
                var projects = db.collection('projects');
                var obj = {
                    project:req.body.project,
                    client:req.body.client
                };
                projects.insert(obj,function(err,result){
                    if(err){
                        console.log(err);
                         db.close();
                    } else {
                        console.log(result);
                         db.close();
                    }
                });
            });
        });

// ADD AN ISSUE
    router.route('/issues')
        .post(function(req, res){
            mongodb.MongoClient.connect(uri, function(err, db) {
                if(err) throw err;
                var projects = db.collection('projects');
                var obj = {
                    project:req.body.project,
                    issueTitle:req.body.issueTitle,
                    issueDescription:req.body.description,
                    currentAssignedTo:{
                            id:req.body.assignedToId,
                            title:req.body.assignedToTitle
                    },
                    dateReported:req.body.dateReported,
                    reportedBy:req.body.reportedBy,
                    lastUpdated:new Date().toISOString(),
                    status:"Open",
                    priority:req.body.priority,
                    type:req.body.type
                };
                projects.insert(obj,function(err,result){
                    if(err){
                        console.log(err);
                         db.close();
                    } else {
                        console.log(result);
                         db.close();
                    }
                });
            });
        });


// ROUTES -------------------------------
app.use('/api', router);
app.use('/',express.static(__dirname + '/public/'));


app.listen(port);
console.log('Server Running');
