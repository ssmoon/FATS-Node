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

router.get('/outersubject/:id', function(req, res, next) {
  let wrapper = buildCommonNodeReturnWrapper(req.params.id);  
  wrapper.itemList = dbContext.OuterSubject.findAll({
    where: { TchNodeID: wrapper.tchNode.Row_ID, TchRoutineID: wrapper.tchNode.RoutineID }
  });  
  
  res.render('outersubject', wrapper);
})

router.get('/generalledger/:id', function(req, res, next) {
  let wrapper = buildCommonNodeReturnWrapper(req.params.id);  
  wrapper.itemList = dbContext.GeneralLedger.findAll({
    where: { TchNodeID: wrapper.tchNode.Row_ID, TchRoutineID: wrapper.tchNode.RoutineID }
  });  
  
  res.render('generalledger', wrapper);
})

router.get('/detailedledger/:id', function(req, res, next) {
  let wrapper = buildCommonNodeReturnWrapper(req.params.id);  
  wrapper.itemList = dbContext.DetailedLedger.findAll({
    where: { TchNodeID: wrapper.tchNode.Row_ID, TchRoutineID: wrapper.tchNode.RoutineID }
  });  
  
  res.render('detailedledger', wrapper);
})

router.get('/customerledger/:id', function(req, res, next) {
  let wrapper = buildCommonNodeReturnWrapper(req.params.id);  
  wrapper.itemList = dbContext.CustomerLedger.findAll({
    where: { TchNodeID: wrapper.tchNode.Row_ID, TchRoutineID: wrapper.tchNode.RoutineID }
  });  
  
  res.render('customerledger', wrapper);
})

router.get('/cashjournal/:id', function(req, res, next) {
  let wrapper = buildCommonNodeReturnWrapper(req.params.id);  
  wrapper.itemList = dbContext.CashJournal.findAll({
    where: { TchNodeID: wrapper.tchNode.Row_ID, TchRoutineID: wrapper.tchNode.RoutineID }
  });  
  
  res.render('outersubject', wrapper);
})

router.get('/subjectfiller/:id', function(req, res, next) {
  let wrapper = buildCommonNodeReturnWrapper(req.params.id);  
  wrapper.itemList = dbContext.SubjectItem.findAll({
    where: { TchNodeID: wrapper.tchNode.Row_ID, TchRoutineID: wrapper.tchNode.RoutineID }
  });  
  
  res.render('outersubject', wrapper);
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