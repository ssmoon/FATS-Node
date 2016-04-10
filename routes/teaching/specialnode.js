'use strict';

const express = require('express');
const router = express.Router();

const dbContext = require('../../app/db-context');
const teachingCache = require('../../app/cache/teaching-cache');
const templateCache = require('../../app/cache/template-cache');

router.get('/:node/:id', function(req, res) {
  let wrapper = buildCommonNodeReturnWrapper(req.params.id);
  let node = req.params.node;
  dbContext[node].findAll({
    where: { TchRoutineID: wrapper.tchNode.RoutineID }
  }).then(function(items) {
    wrapper.itemList = items;
    res.render(node, wrapper);  
  })
});


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