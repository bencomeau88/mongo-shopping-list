var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Item = require('./models/item');
var config = require('./config');
var app = express();
//import the storage lib from before
var storageLib = require('../shopping-list/storage.js');

app.use(bodyParser.json());
app.use(express.static('public'));

var storage = new storageLib.Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var runServer = function(callback) {
    mongoose.connect(config.DATABASE_URL, function(err) {
        if (err && callback) {
            return callback(err);
        }

        app.listen(config.PORT, function() {
            console.log('Listening on localhost:' + config.PORT);
            if (callback) {
                callback();
            }
        });
    });
};

app.get('/items', function(req, res) {
    Item.find(function(err, items) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        res.status(200).json(items);
    });
});

app.post('/items', function(req, res) {
    Item.create({
        name: req.body.name
    }, function(err, item) {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        var item = storage.add(req.body.name);
        res.status(201).json(item);
    });
});

app.put('/items/:id', function(req,res){
    Item.update({_id: req.params.id}, {name:req.body.name}, function(err, item){
        if(err){
            return res.status(404);
        }
        res.status(200).json(item)
    });
});

app.delete('/items/:id', function(req,res){
    Item.remove({_id: req.params.id}, function(err,item){
        if(err){
            return res.status(500).json({
                message: 'delete error'
            });
        }
        res.status(201).json(item);
    });
});

app.use('*', function(req, res) {
    res.status(404).json({
        message: 'Not Found'
    });
});



if (require.main === module) {
    runServer(function(err) {
        if (err) {
            console.error(err);
        }
    });
};

exports.storage = storage;
exports.app = app;
exports.runServer = runServer;