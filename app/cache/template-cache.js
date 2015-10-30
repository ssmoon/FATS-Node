'use strict';

const dbContext = require('../db-context');
const co = require('co');

class TemplateCache {    
  constructor() {
    let self = this;
    self.routineHash = {};
    self.allNodeHash = {};
    co(function *() {
      let routines = yield dbContext.TemplateRoutine.findAll();
      routines.forEach(function(routine) {
        self.routineHash[routine.Row_ID] = routine;
      }, this); 
      
      let nodeList = yield dbContext.TemplateNode.findAll();
      nodeList.forEach(function(node) {
        if (!self.routineHash[node.RoutineID].NodeList) {
          self.routineHash[node.RoutineID].nodeList = [];
          self.routineHash[node.RoutineID].nodeHash = {};
        }
        self.routineHash[node.RoutineID].nodeList.push(node);
        self.routineHash[node.RoutineID].nodeHash[node.Row_ID] = node;
        self.allNodeHash[node.Row_ID] = node;
      }, this);    
    }).catch(function (err) {
      console.error(err.stack);
    });
  }
  
  getTemplateRoutine(templateRoutineID) {
    return this.routineHash[templateRoutineID];
  }
  
  getTemplateNode(tmpNodeID) {
    return this.allNodeHash[tmpNodeID];
  }
  
  getNextNode(tmpRoutineID, tmpNodeID) {
    let node = this.getTemplateNode(tmpRoutineID, tmpNodeID);
    let currIdx = this.routineHash[tmpRoutineID].nodeList.indexOf(node);
    if (currIdx == this.routineHash[tmpRoutineID].nodeList.length - 1)
      return null;
    else return this.routineHash[tmpRoutineID].nodeList[currIdx + 1];
  }
}

module.exports = new TemplateCache();

