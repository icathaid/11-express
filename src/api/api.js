'use strict';

// const router = require('../lib/router.js');
// const Notes = require('../models/notes.js');
import Notes from '../models/notes.js';
// const express = require('express');
import express from 'express';
const router = express.Router();



/**
 * Simple method to send a JSON response (all of the API methods will use this)
 * @param res
 * @param data
 */
let sendJSON = (res,data) => {
  res.statusCode = 200;
  res.statusMessage = 'OK';
  res.setHeader('Content-Type', 'application/json');
  res.write( JSON.stringify(data) );
  res.end();
};

let serverError = (res,err) => {
  let error = { error:err };
  res.statusCode = 500;
  res.statusMessage = 'Server Error';
  res.setHeader('Content-Type', 'application/json');
  res.write( JSON.stringify(error) );
  res.end();
};

router.get('/api/v1/notes', (req,res) => {
    Notes.fetchAll()
      .then( data => sendJSON(res,data) )
      .catch( err => serverError(res,err) );
});

router.get('/api/v1/notes/:id', (req,res) => {
    if(req.params.id){
      Notes.findOne(req.params.id)
      .then( data => sendJSON(res,data) )
      .catch( err => serverError(res,err) );
    } else {
      serverError(res, 'No Record Found');
    }
});

router.delete('/api/v1/notes', (req,res) => {
  if ( req.query.id ) {
    Notes.deleteOne(req.query.id)
      .then( success => {
        let data = {id:req.query.id,deleted:success};
        sendJSON(res,data);
      })
  }
});

router.post('/api/v1/notes', (req,res) => {
  console.log(req.body, 'req.body');
  console.log(req.body.title, 'req.body.title');
  console.log(req.body.content, 'req.body.content');
  let record = new Notes(req.body);
  record.save()
    .then(data => sendJSON(res,data))
    .catch(console.error);
});

export default router;
// module.exports = router;