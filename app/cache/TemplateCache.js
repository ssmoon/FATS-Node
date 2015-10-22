'use strict';

const dbContext = require('../dbContext');
const co = require('co');

class TemplateCache {    
  constructor() {
    let self = this;
    self.routineList = {};
    co(function *() {
      let routines = yield dbContext.templateRoutine.findAll();
      routines.forEach(function(routine) {
        self.routineList[routine.Row_ID] = routine;
      }, this); 
      
      let nodeList = yield dbContext.templateNode.findAll();
      nodeList.forEach(function(node) {
        if (!self.routineList[node.RoutineID].NodeList) {
          self.routineList[node.RoutineID].nodeList = [];
          self.routineList[node.RoutineID].nodeHash = {};
        }
        self.routineList[node.RoutineID].nodeList.push(node);
        self.routineList[node.RoutineID].nodeHash[node.Row_ID] = node;
      }, this);    
    }).catch(function (err) {
      console.error(err.stack);
    });
  }
  
  getTemplateRoutine(templateRoutineID) {
    return this.routineList[templateRoutineID];
  }
  
  getTemplateNode(tmpRoutineID, tmpNodeID) {
    return this.routineList[tmpRoutineID].nodeHash[tmpNodeID];
  }
  
  getNextNode(tmpRoutineID, tmpNodeID) {
    let node = this.getTemplateNode(tmpRoutineID, tmpNodeID);
    let currIdx = this.routineList[tmpRoutineID].nodeList.indexOf(node);
    if (currIdx == this.routineList[tmpRoutineID].nodeList.length - 1)
      return null;
    else return this.routineList[tmpRoutineID].nodeList[currIdx + 1];
  }
}

module.exports = new TemplateCache();

