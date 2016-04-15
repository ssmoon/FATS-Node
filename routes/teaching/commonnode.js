'use strict';

const express = require('express');
const router = express.Router();
const dbContext = require('../../app/db-context');
const teachingCache = require('../../app/cache/teaching-cache');
const templateCache = require('../../app/cache/template-cache');

router.get('/Guide/:id', function(req, res, next) {
  let tchNodeID = req.params.id;
  let tchNode = teachingCache.getNode(tchNodeID);
  let group = teachingCache.getNodeGroup(tchNodeID);
  let tchRoutine = teachingCache.getRoutine(tchNode.RoutineID);
  let groups = teachingCache.getAllGroup(tchRoutine.Row_ID);
    
  res.render('guide', {
    group: group,
    groups: groups,
    tchNode: tchNode,
    tchRoutine: tchRoutine 
  });
})

router.get('/:node/:id', function(req, res, next) {
  let wrapper = buildCommonNodeReturnWrapper(req.params.id);
  let node = req.params.node;
  
  co(function *() {
      wrapper.itemList = yield dbContext[node].findAll({ 
        where: { TchNodeID: wrapper.tchNode.Row_ID, TchRoutineID: wrapper.tchNode.RoutineID } 
      });     
      res.render('tcommon/' + node, wrapper);  
  })
})

function buildCommonNodeReturnWrapper(tchNodeID) {
  let tchNode = teachingCache.getNode(tchNodeID);
  let tchRoutine = teachingCache.getRoutine(tchNode.RoutineID);

  let group = teachingCache.getNodeGroup(tchNodeID);
  let tmpRoutine = templateCache.getTemplateRoutine(tchRoutine.TmpRoutineID);
  let tmpNode = templateCache.getTemplateNode(tchNode.TmpNodeID);
  return {    
    routineName: tmpRoutine.RoutineName,
    nodeName: tmpNode.NodeName,
    groupText: group.GroupText,
    tchNode: tchNode
  };
}

module.exports = router;