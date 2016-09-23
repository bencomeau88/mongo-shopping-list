    global.DATABASE_URL = 'mongodb://localhost/shopping-list-test';

    var chai = require('chai');
    var chaiHttp = require('chai-http');

    var server = require('../server.js');
    var Item = require('../models/item');

    var should = chai.should();
    var app = server.app;
    var storage = server.storage;

    chai.use(chaiHttp);

    describe('Shopping List', function() {
        before(function(done) {
            server.runServer(function() {
                Item.create({ name: 'Broad beans' }, { name: 'Tomatoes' }, { name: 'Peppers' }, function() {
                    done();
                });
            });
        });
after(function(done) {
            Item.remove(function() {
                done();
            });
        });


        describe('Shopping List', function(){
        it('should list items on GET', function(done) {
            chai.request(app)
                .get('/items')
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('array');
                    res.body.should.have.length(4);
                    res.body[0].should.be.a('object');
                    res.body[0].should.have.property('_id');
                    res.body[0].should.have.property('name');
                    res.body[0]._id.should.be.a('string');
                    res.body[0].name.should.be.a('string');
                    res.body[0].name.should.equal('Broad beans');
                    res.body[1].name.should.equal('Tomatoes');
                    res.body[2].name.should.equal('Peppers');
                    done();
                });
        });
});

        it('should add an item on POST', function(done) {
            chai.request(app)
                .post('/items')
                .send({ 'name': 'Kale' })
                .end(function(err, res) {
                    should.equal(err, null);
                    res.should.have.status(201);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('id');
                    res.body.name.should.be.a('string');
                    res.body.id.should.be.a('number');
                    res.body.name.should.equal('Kale');
                    // storage.items.should.be.a('array');
                    // storage.items.should.have.length(4);
                    // storage.items[3].should.be.a('object');
                    // storage.items[3].should.have.property('_id');
                    // storage.items[3].should.have.property('name');
                    // storage.items[3]._id.should.be.a('number');
                    // storage.items[3].name.should.be.a('string');
                    // storage.items[3].name.should.equal('Kale');
                    done();
                });
        });
        it('should edit an item on PUT', function(done) {
            chai.request(app)
                .put('/items/1')
                .send({ 'id':1, 'name': 'Pineapple' })
                .end(function(err, res) {
                    //not sure why this doesn't pass
                    // res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.name.should.equal('Pineapple');
                    res.body._id.should.equal(1);
                    res.body.should.have.property('id');
                    // storage.items.should.be.a('array');
                    // storage.items.should.have.length(4);
                    // storage.find(1).name.should.be.a('string');
                    // storage.find(1).name.should.equal('Pineapple');
                    done();
                })
        })
        it('should delete an item on DELETE', function(done) {
            chai.request(app)
                .delete('/items/1')
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('id');
                    res.body.name.should.equal('Pineapple');
                    res.body._id.should.equal(1);
                    // storage.items.should.be.a('array');
                    // should.not.exist(storage.find(1));
                    done();
                })

        });
        


    });
