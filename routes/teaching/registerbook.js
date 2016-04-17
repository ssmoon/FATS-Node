'use strict';

const express = require('express');
const router = express.Router();
const co = require('co');

const dbContext = require('../../app/db-context');
const teachingCache = require('../../app/cache/teaching-cache');
const templateCache = require('../../app/cache/template-cache');

router.get('/:node/:id', function(req, res) {
  let wrapper = buildCommonNodeReturnWrapper(req.params.id);
  let node = req.params.node;
  
  co(function *() {
      wrapper.itemList = yield dbContext[node].findAll({ where: { TchRoutineID: wrapper.tchNode.RoutineID } });
      res.render('tregister/' + node, wrapper);  
  })
});


function buildCommonNodeReturnWrapper(tchNodeID) {
  let tchNode = teachingCache.getNode(tchNodeID);
  let tchRoutine = teachingCache.getRoutine(tchNode.RoutineID);

  let group = teachingCache.getNodeGroup(tchNodeID);
  let tmpRoutine = templateCache.getTemplateRoutine(tchRoutine.TmpRoutineID);
  let tmpNode = templateCache.getTemplateNode(tchNode.TmpNodeID);
  return {    
    routineTag: tmpRoutine.RoutineTag,
    routineName: tmpRoutine.RoutineName,
    nodeName: tmpNode.NodeName,
    groupText: group.GroupText,
    tchNode: tchNode,
    nodeIndex: tmpNode.NodeIndex
  };
}

module.exports = router;