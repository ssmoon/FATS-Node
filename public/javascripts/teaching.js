'use strict';

require('../stylesheets/siteschema.css');
require('../stylesheets/shared/datatables.css');
require('../stylesheets/teachings/selectT1Case.css');
require('../stylesheets/teachings/teaching1Comm.css');
require('../stylesheets/teachings/subjectFiller.css');
require("script!./shared/datatables.js");

var loginMng = require('./users/login');
var registerMgr = require('./users/register');
var navigationT1Mng = require('./teachings/teaching1Comm');
var caseSelectionMgr = require('./teachings/selectT1Case');
var subjectFiller = require('./teachings/subjectFiller')

$(document).ready(function () {
  if ($("#routineoverview").length > 0) {
    $("#routineoverview .group[data-groupidx=" + $("#CurrGroup").val() + "]").addClass("currgroup");
    $("#routineoverview .arrowcontainer").css("height", $("#routineoverview .mainprocess").css("height"));
    var groupRelativePos = (Number($("#CurrGroup").val()) - 1) * 190;
    $("#routineoverview .arrowcontainer").css("background-position", "8px " + (groupRelativePos + 13) + "px");
    $("#routineoverview .currphase").css("top", (groupRelativePos == 0 ? 0 : (groupRelativePos - 20)) + "px");
    $("#routineoverview .group[data-node-id]").on("click", function () {
      window.location = "/Teaching/CommonNode/Guide/" + $(this).attr("data-node-id");
    })
    $("#routineoverview").on("click", "button[data-act=go]", function () {
      navigationT1Mng.goNextStep();
    })
    if ($("#CurrGroup").length > 0)
      navigationT1Mng.checkStatus = 1;
  }

  if ($("#navbar").length > 0) {
    navigationT1Mng.initEvent();
  }

  if ($("#casearea").length > 0) {
    caseSelectionMgr.initCaseTable();
    //  caseSelectionMgr.initStudiedTable();
    caseSelectionMgr.initPageEvent();
  }

  if ($("#fillerstepper").length > 0) {
    var uniqueSubjectObj = {};
    $("#fillerstepper a[data-index]").each(function() {
      if (uniqueSubjectObj.hasOwnProperty($(this).attr("data-subject")))
        uniqueSubjectObj[$(this).attr("data-subject")].push($(this).attr("data-index"));
      else uniqueSubjectObj[$(this).attr("data-subject")] = [ $(this).attr("data-index") ];
    })
    for (var key in uniqueSubjectObj) {
      if (!uniqueSubjectObj.hasOwnProperty(key))
        continue;
      if (uniqueSubjectObj[key].length == 1)
        continue;
      var duplicatedKeys = uniqueSubjectObj[key];
      var preservedIndex = duplicatedKeys[0];
      for (var i = 1; i <= duplicatedKeys.length - 1; i ++) {
        $("#fillerstepper a[data-index=" + duplicatedKeys[i] + "]").remove();
        $("#maincontainer div[data-index=" + preservedIndex + "] tbody").append($("#maincontainer div[data-index=" + duplicatedKeys[i] + "] tr:last"));
        $("#maincontainer div[data-index=" + duplicatedKeys[i] + "]").remove();
      }
    }

    $("#fillerstepper a").on("click", function () {
      $("#fillerstepper a").removeClass("active");
      $(this).addClass("active");
      $("#subjectcontainer div[data-subject]").hide();
      $("#subjectcontainer div[data-subject='" + $(this).attr("data-subject") + "']").show();

    });
    $("#fillerstepper").css("left", $(".maincont").offset().left);
    $("#fillerstepper").show();
    $("#fillerstepper a:first").click();
  }
  
  if ($('#subjectfiller').length > 0) {
    subjectFiller.initCtrls();
    subjectFiller.initEvent(); 
  }  
  
  if ($('#noaction').length > 0) {
    navigationT1Mng.checkStatus = 1;
  }  


})

var teachingPackMng = {};

module.exports = teachingPackMng;
