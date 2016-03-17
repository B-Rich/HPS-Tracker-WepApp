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
router.route('/issues/limited/')
    .get(function(req,res){
        var d = [];
        mongodb.MongoClient.connect(uri, function(err, db) {
            var issues = db.collection('issues');
            var searchObj = {};
            if(req.query.project){
                searchObj["project"] = req.query.project;
            }
            if(req.query.status){
                searchObj["status"] = req.query.status;
            }
            issues.find (searchObj,{
                    '_id':true,
                    'issueTitle':true,
                    'issueDescription':true,
                    'currentAssignedTitle':true,
                    'status':true,
                    'type':true,
                    'project':true
                }).toArray(function(err,docs){
                if(err) throw err;
                res.json(docs);
            });
        });
    });

    // GET ALL ISSUES (ALL DATA)
    router.route('/issues/')
        .get(function(req,res){
            var d = [];
            mongodb.MongoClient.connect(uri, function(err, db) {
                var issues = db.collection('issues');
                var searchObj = {};
                if(req.query.project){
                    searchObj["project"] = req.query.project;
                }
                if(req.query.status){
                    searchObj["status"] = req.query.status;
                }
                if(req.query.id){
                    searchObj["_id"] = req.query.id;
                }
                issues.find(searchObj).toArray(function(err,docs){
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
                        res.json(err);
                         db.close();
                    } else {
                        res.json(result);
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
                var issues = db.collection('issues');
                var obj = req.body.d;
                issues.insert(obj,function(err,result){
                    if(err){
                        res.json(err);
                         db.close();
                    } else {
                        res.json(result);
                         db.close();
                    }
                });
            });
        });
// ADD A COMMENT
    router.route('/addComment')
        .put(function(req, res){
            mongodb.MongoClient.connect(uri, function(err, db) {
                if(err) throw err;
                var issues = db.collection('issues');
                issues.updateOne(
                {_id: req.body.id},
                {
                  $set: {comments: req.body.comments}
                },function(err,result){
                    if(err){
                        res.json(err);
                         db.close();
                    } else {
                        res.json(result);
                         db.close();
                    }
                });
            });
        });

// ROUTES -------------------------------
app.use('/api', router);
app.use('/',express.static(__dirname));


app.listen(port);
console.log('Server Running');
