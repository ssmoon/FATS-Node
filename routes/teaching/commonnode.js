'use strict';

const express = require('express');
const router = express.Router();
const dbContext = require('../../app/db-context');
const teachingCache = require('../../app/cache/teaching-cache');

router.get('/guide/:id', function(req, res, next) {
  let tchNodeID = req.params.id;
  let tchNode = teachingCache.getNode(tchNodeID);
  let group = teachingCache.getNodeGroup(tchNodeID);
  let tchRoutine = teachingCache.getRoutine(tchNode.RoutineID);
  res.render('guide', {
    group: group,
    tchNode: tchNode,
    tchRoutine: tchRoutine 
  });
})

router.get('/outersubject', function(req, res, next) {
  
})


module.exports = router;