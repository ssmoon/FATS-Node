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
      let groups = yield dbContext.RoutineGroup.findAll();
      groups.forEach(group => {
        if (self.routineHash[group.RoutineID]) {
          if (!self.routineHash[group.RoutineID].groupHash) {
            self.routineHash[group.RoutineID].groupHash = {};
            self.routineHash[group.RoutineID].groupList = [];
          }
          self.routineHash[group.RoutineID].groupHash[group.Row_ID] = group;
          self.routineHash[group.RoutineID].groupList.push(group);
        }
      })
      
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
    let groupIdx = templateCache.getTemplateNode(tchNode.TmpNodeID);
    return self.routinehash[tchNode.RoutineID].groupList[groupIdx];
  }
  
  getFirstNode(tchRoutineID) {
    let firstNodeID = this.routineHash[tchRoutineID].nodeList[0];
    return this.routineHash[tchRoutineID].nodeHash[firstNodeID];
  }
  
  getNextNode(tchRoutineID, tchNodeID) {
    let nodeList = this.routineHash[tchRoutineID].nodeList;
    let currNodeIdx = nodeList.indexOf(tchNodeID);
    if (currNodeIdx === nodeList.length - 1) {
      return null;
    }
    else return this.routineHash[tchRoutineID].nodeHash[nodeList[currNodeIdx + 1]];
  }
  
  getPrevNode(tchRoutineID, tchNodeID) {
    let nodeList = this.routineHash[tchRoutineID].nodeList;
    let currNodeIdx = nodeList.indexOf(tchNodeID);
    if (currNodeIdx === 0) {
      return null;
    }
    else return this.routineHash[tchRoutineID].nodeHash[nodeList[currNodeIdx - 1]];
  }
}

module.exports = new TeachingCache();