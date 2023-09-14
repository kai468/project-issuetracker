'use strict';

const mongoose = require('mongoose');

module.exports = function (app) {

  const issueSchema = new mongoose.Schema({
    issue_title: {required: true, type: String},
    issue_text: {required: true, type: String},
    created_by: {required: true, type: String},
    project: {required: true, type: String},
    created_on: {type: Date, default: Date.now},
    updated_on: Date,
    open: {type: Boolean, default: true},
    status_text: {type: String, default: ""},
    assigned_to: {type: String, default: ""}
  });

  const Issue = mongoose.model('issues', issueSchema, 'issues');

  // CRUD: 
  const createIssue = function(req, res) {
    const project = req.params.project;
    const issue = {...req.body, project: project}; 
    if (!issue.updated_on) {
      issue.updated_on = Date.now();
    }
    const issueModel = new Issue(issue);

    issueModel
      .save()
      .then(
        newIssue => res.json(newIssue),
        err => res.json({error: "required field(s) missing"}),
      ).catch(err => {throw new Error(err)});
  }

  const findIssues = async function(req, res) {
    const project = req.params.project; 
    try {
      const issues = await Issue.find({...req.body, project: project});
      res.json(issues);
    } catch (err) {
      throw new Error(err);
    }  
  }

  const updateIssue = function(req, res) {
    const project = req.params.project;
    const _id = req.body._id;

    if (!_id) {
      res.json({error: "missing _id"});
      return;
    }

    delete req.body._id;
    // delete not overwritten keys: 
    Object.keys(req.body).forEach( (k, i) => {
      if (!req.body[k]) {
        delete req.body[k];
      }
    });

    if (Object.keys(req.body).length == 0) {
      res.json({error: "no update field(s) sent", _id: _id});
      return; 
    }

    Issue
      .updateOne({_id: _id, project: project}, {...req.body, updated_on: Date.now()})
      .then(
        success => {
          if (success.modifiedCount == 1) {
            res.json({result: "successfully updated", _id: _id});
          } else {
            res.json({error: "could not update", _id: _id});
          }
        }
      ).catch(err => res.json({error: "could not update", _id: _id}));
  }

  const deleteIssue = function(req, res) {
    const project = req.params.project; 
    const _id = req.body._id;

    if (!_id) {
      res.json({error: "missing _id", _id: _id});
      return;
    }

    Issue
      .deleteOne({_id: _id, project: project})
      .then(
        success => {
          if (success.deletedCount == 1) {
            res.json({result: "successfully deleted", _id: _id});
          } else {
            res.json({error: "could not delete", _id: _id});
          }
        },
        err => res.json({error: "could not delete", _id: _id}),
      ).catch(err => {throw new Error(err)});
  }

  app.route('/api/issues/:project')
    .get(findIssues)
    .post(createIssue)
    .put(updateIssue)
    .delete(deleteIssue);
};
