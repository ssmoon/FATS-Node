'use strict';

const express = require('express');
const router = express.Router();
const co = require('co');

const dbContext = require('../../app/db-context');
const teachingCache = require('../../app/cache/teaching-cache');
const templateCache = require('../../app/cache/template-cache');
const userMng = require('../../app/logic/user');
const constDefine = require('../../app/const');
const webUtil = require('../../app/webutil');

router.get('/Select', function(req, res, next) {
  if (!userMng.getCurrentUserID(req.session))
  {
    res.redirect('/User/Login');
    return;
  }
  dbContext.TemplateRoutine.findAll({ where: { RoutineType: constDefine.RoutineType_Teaching1 } }).then(function(routines) {
    res.render('SelectCase', { routines: routines });
  })
});

router.post('/Context', function(req, res, next) {
  let tchRoutineID = req.body.teachingRoutineID;
  let tchNodeID = req.body.teachingNodeID;
 
 /* 
  let tchRoutine = teachingCache.getRoutine(tchRoutineID);
  let tchNode = teachingCache.getNode(tchRoutineID, tchNodeID);
  let tmpRoutine = templateCache.getTemplateRoutine(tchRoutineID.TmpRoutineID);
  */
  
  let clientContext = {};
  clientContext.isTeacher = userMng.checkIsTeacher(req.session);
  clientContext.tchRoutineID = tchRoutineID;
  
  let prevNode = teachingCache.getPrevNode(tchRoutineID, tchNodeID);
  if (!prevNode) {
    clientContext.PrevTchNodeID = -1;
    clientContext.PrevTchNodeTag = '';
    clientContext.PrevTchNodeType = '';
  }
  else {
    let templateNode = templateCache.getTemplateNode(prevNode.TmpNodeID);  
      
    clientContext.PrevTchNodeID = prevNode.Row_ID;
    clientContext.PrevTchNodeTag = templateNode.Tag;
    clientContext.PrevTchNodeType = templateNode.NodeType;
  }
  
  let nextNode = teachingCache.getNextNode(tchRoutineID, tchNodeID);
  if (!nextNode) {
    clientContext.NextTchNodeID = -1;
    clientContext.NextTchNodeTag = '';
    clientContext.NextTchNodeType = '';
  }
  else {
    let templateNode = templateCache.getTemplateNode(nextNode.TmpNodeID);  
      
    clientContext.NextTchNodeID = nextNode.Row_ID;
    clientContext.NextTchNodeTag = templateNode.Tag;
    clientContext.NextTchNodeType = templateNode.NodeType;
  }
  res.json(clientContext);
});

router.post('/Start', function(req, res, next) {
  let tchRoutineID = req.body.tchRoutineID;
//  let tchRoutine = teachingCache.getRoutine(tchRoutineID);
  let firstNode = teachingCache.getFirstNode(tchRoutineID);
  let relTmpNode = templateCache.getTemplateNode(firstNode.TmpNodeID);
  res.json(`${relTmpNode.NodeType}/${relTmpNode.Tag}/${firstNode.Row_ID}`);  
});

router.post('/AllRoutine', function(req, res, next) {
  let tmpRoutineID = req.body.tmpRoutineID;
  if (!tmpRoutineID) {
    res.json(webUtil.wrapClientGridData([]));
    return;
  }
  dbContext.TeachingRoutine.findAll({ 
    where: { TmpRoutineID: tmpRoutineID } 
  }).then(function(tchRoutineList) {
    res.json(webUtil.wrapClientGridData(tchRoutineList));
  })
});



module.exports = router;