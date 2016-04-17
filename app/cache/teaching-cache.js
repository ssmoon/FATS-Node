'use strict';

const dbContext = require('../db-context');
const templateCache = require('./template-cache');
const co = require('co');

class TeachingCache {
  constructor() {
    this.rebuildCache();
  }
  
  rebuildCache() {    
    let self = this;
    self.routineHash = {};
    self.allNodeHash = {};
    co(function *() {
      let routines = yield dbContext.TeachingRoutine.findAll();
      routines.forEach(routine => {
        self.routineHash[routine.Row_ID] = routine;
      });
            
      let nodes = yield dbContext.TeachingNode.findAll();
      nodes.forEach(node => {
        //purge overflowed junk data
        if (self.routineHash[node.RoutineID]) {
          if (!self.routineHash[node.RoutineID].nodeList) {
            self.routineHash[node.RoutineID].nodeHash = {};
            self.routineHash[node.RoutineID].nodeList = [];
          }
          self.routineHash[node.RoutineID].nodeHash[node.Row_ID] = node;        
          self.routineHash[node.RoutineID].nodeList.push(node.Row_ID);
          self.allNodeHash[node.Row_ID] = node;
        }
      })
      
      let groups = yield dbContext.RoutineGroup.findAll({});
      groups.forEach(group => {
        if (self.routineHash[group.TchRoutineID]) {
          if (!self.routineHash[group.TchRoutineID].groupHash) {
            self.routineHash[group.TchRoutineID].groupHash = {};
            self.routineHash[group.TchRoutineID].groupList = [];
          }
          
          let belongRoutine = self.routineHash[group.TchRoutineID];
          for (let i = 0; i <= belongRoutine.nodeList.length - 1; i ++) {
            let relTmpNode = templateCache.getTemplateNode(belongRoutine.nodeHash[belongRoutine.nodeList[i]].TmpNodeID)
            if (relTmpNode.GroupIdx === group.GroupIdx) {
              group.FirstNodeID = belongRoutine.nodeList[i];
              break;
            }
          }
          
          self.routineHash[group.TchRoutineID].groupHash[group.Row_ID] = group;
          self.routineHash[group.TchRoutineID].groupList.push(group);
        }
      })
    });    
  }
  
  getRoutine(tchRoutineID) {
    return this.routineHash[tchRoutineID];
  }
  
  getNode(tchNodeID) {
    return this.allNodeHash[tchNodeID];     
  }
  
  getNodeGroup(tchNodeID) {
    let tchNode = this.allNodeHash[tchNodeID];
    let groupIdx = templateCache.getTemplateNode(tchNode.TmpNodeID).GroupIdx;
    return this.routineHash[tchNode.RoutineID].groupList[groupIdx - 1];
  }
  
  getAllGroup(tchRoutineID) {    
    return this.routineHash[tchRoutineID].groupList;
  }
  
  getFirstNode(tchRoutineID) {
    let firstNodeID = this.routineHash[tchRoutineID].nodeList[0];
    return this.routineHash[tchRoutineID].nodeHash[firstNodeID];
  }
  
  getNextNode(tchRoutineID, tchNodeID) {
    let nodeList = this.routineHash[tchRoutineID].nodeList;
    let currNodeIdx = nodeList.indexOf(Number(tchNodeID));
    if (currNodeIdx === nodeList.length - 1) {
      return null;
    }
    else return this.routineHash[tchRoutineID].nodeHash[nodeList[currNodeIdx + 1]];
  }
  
  getPrevNode(tchRoutineID, tchNodeID) {
    let nodeList = this.routineHash[tchRoutineID].nodeList;
    let currNodeIdx = nodeList.indexOf(Number(tchNodeID));
    if (currNodeIdx === 0) {
      return null;
    }
    else return this.routineHash[tchRoutineID].nodeHash[nodeList[currNodeIdx - 1]];
  }
}

module.exports = new TeachingCache();