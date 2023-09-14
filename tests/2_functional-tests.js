const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const { expect } = require('chai');

const PROJECT = "testproject"; 

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    test('Create an issue with every field: POST request to /api/issues/{project}', function(done) {
        const body = {
            issue_title: "dummy",
            status_text: "dummy",
            created_by: "dummy",
            assigned_to: "dummy",
            issue_text: "dummy"
        }
        chai
            .request(server)
            .post('/api/issues/' + PROJECT)
            .send(body)
            .end( (err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200); 
                expect(res.body.issue_text).to.equal("dummy");
                expect(res.body.issue_title).to.equal("dummy");
                expect(res.body.created_by).to.equal("dummy");
                expect(res.body.assigned_to).to.equal("dummy");
                expect(res.body.status_text).to.equal("dummy");
                expect(res.body.open).to.be.true;
                expect(res.body).to.have.property("created_on");
                expect(res.body).to.have.property("updated_on");
                expect(res.body).to.have.property("_id");
                expect(res.body.project).to.equal(PROJECT);
                done();
            });
    });

    test('Create an issue with only required fields: POST request to /api/issues/{project}', function(done) {
        const body = {
            issue_title: "dummy",
            created_by: "dummy",
            issue_text: "dummy"
        }
        chai
            .request(server)
            .post('/api/issues/' + PROJECT)
            .send(body)
            .end( (err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200); 
                expect(res.body.issue_text).to.equal("dummy");
                expect(res.body.issue_title).to.equal("dummy");
                expect(res.body.created_by).to.equal("dummy");
                expect(res.body.open).to.be.true;
                expect(res.body).to.have.property("created_on");
                expect(res.body).to.have.property("updated_on");
                expect(res.body).to.have.property("assigned_to");
                expect(res.body).to.have.property("status_text");
                expect(res.body).to.have.property("_id");
                expect(res.body.project).to.equal(PROJECT);
                done();
            });
    });

    test('Create an issue with missing required fields: POST request to /api/issues/{project}', function(done) {
        const body = {
            issue_title: "dummy",
            issue_text: "dummy"
        }
        chai
            .request(server)
            .post('/api/issues/' + PROJECT)
            .send(body)
            .end( (err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200); 
                expect(res.body.error).to.equal("required field(s) missing");
                done();
            });
    });

    test('View issues on a project: GET request to /api/issues/{project}', function(done) {
        chai
            .request(server)
            .get('/api/issues/' + PROJECT)
            .end( (err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200); 
                expect(res.body.issues).to.be.an('array');
                res.body.issues.every(i => expect(i.project).to.equal(PROJECT));
                done();
            });
    });

    test('View issues on a project with one filter: GET request to /api/issues/{project}', function(done) {
        const body = {
            created_by: "dummy"
        };
        chai
            .request(server)
            .get('/api/issues/' + PROJECT)
            .send(body)
            .end( (err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200); 
                res.body.issues.every(i => expect(i.project).to.equal(PROJECT));
                res.body.issues.every(i => expect(i.created_by).to.equal("dummy"));
                done();
            });
    });

    test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function(done) {
        const body = {
            created_by: "dummy",
            issue_text: "dummy"
        };
        chai
            .request(server)
            .get('/api/issues/' + PROJECT)
            .send(body)
            .end( (err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200); 
                res.body.issues.every(i => expect(i.project).to.equal(PROJECT));
                res.body.issues.every(i => expect(i.created_by).to.equal("dummy"));
                res.body.issues.every(i => expect(i.issue_text).to.equal("dummy"));
                done();
            });
    });
    
    test('Update one field on an issue: PUT request to /api/issues/{project}', function (done) {
        const body = {
            _id: "6503185d0a226aa182f9f58e",
            issue_text: "test"
        }
        chai
            .request(server)
            .put('/api/issues/' + PROJECT)
            .send(body)
            .end( (err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200); 
                expect(res.body.result).to.equal("successfully updated");
                expect(res.body._id).to.equal("6503185d0a226aa182f9f58e");
                done();
            });
    });

    test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function (done) {
        const body = {
            _id: "6503185d0a226aa182f9f58e",
            issue_text: "dummy",
            open: false            
        }
        chai
            .request(server)
            .put('/api/issues/' + PROJECT)
            .send(body)
            .end( (err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200); 
                expect(res.body.result).to.equal("successfully updated");
                expect(res.body._id).to.equal("6503185d0a226aa182f9f58e");
                done();
            });
    });
    
    test('Update an issue with missing _id: PUT request to /api/issues/{project}', function (done) {
        const body = {
            issue_text: "dummy",
            open: false            
        }
        chai
            .request(server)
            .put('/api/issues/' + PROJECT)
            .send(body)
            .end( (err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200); 
                expect(res.body.error).to.equal("could not update");
                done();
            });
    });

    test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function (done) {
        const body = {
            _id: "6503185d0a226aa182f9f58e"           
        }
        chai
            .request(server)
            .put('/api/issues/' + PROJECT)
            .send(body)
            .end( (err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200); 
                expect(res.body.error).to.equal("could not update");
                expect(res.body._id).to.equal("6503185d0a226aa182f9f58e");
                done();
            });
    });

    test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function (done) {
        const body = {
            _id: "ffffffffffffffffffffffff",
            issue_text: "dummy"            
        }
        chai
            .request(server)
            .put('/api/issues/' + PROJECT)
            .send(body)
            .end( (err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200); 
                expect(res.body.error).to.equal("could not update");
                expect(res.body._id).to.equal("ffffffffffffffffffffffff");
                done();
            });
    });

    test('Delete an issue: DELETE request to /api/issues/{project}', function(done) {
        const body = {
            issue_title: "dummy",
            created_by: "dummy",
            issue_text: "dummy"
        }
        chai
            .request(server)
            .post('/api/issues/' + PROJECT)
            .send(body)
            .end( (err, res) => {
                const id = res.body._id; 
                chai
                    .request(server)
                    .delete('/api/issues/' + PROJECT)
                    .send({_id: id})
                    .end( (err, res) => {
                        expect(err).to.be.null;
                        expect(res).to.have.status(200); 
                        expect(res.body.result).to.equal("successfully deleted");
                        expect(res.body._id).to.equal(id);
                        done();
                    });
            })
    });

    test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function(done) {
        const body = {
            issue_title: "abc"
        }
        chai
            .request(server)
            .delete('/api/issues/' + PROJECT)
            .send(body)
            .end( (err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200); 
                expect(res.body.error).to.equal("could not delete");
                done();
            });
    });

    test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function(done) {
        const body = {
            _id: "ffffffffffffffffffffffff"
        }
        chai
            .request(server)
            .delete('/api/issues/' + PROJECT)
            .send(body)
            .end( (err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200); 
                expect(res.body.error).to.equal("could not delete");
                expect(res.body._id).to.equal("ffffffffffffffffffffffff");

                done();
            });
    });

    // TEMPLATE: 
    /*
    test('', function(done) {
        const body = {
            issue_title: "dummy",
            status_text: "dummy",
            created_by: "dummy",
            assigned_to: "dummy",
            issue_text: "dummy"
        }
        chai
            .request(server)
            .get('/api/issues/' + PROJECT)
            .send(body)
            .end( (err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200); 


                done();
            });
    });
    */
});
