'use strict';

require('../stylesheets/siteschema.css');
require('../stylesheets/shared/datatables.css');
require('../stylesheets/teachings/selectT1Case.css');
require('../stylesheets/teachings/teaching1Comm.css');
require('../stylesheets/teachings/subjectFiller.css');
require("script!./shared/datatables.js");

var navigationT1Mng = require('./teachings/teaching1Comm');
var caseSelectionMgr = require('./teachings/selectT1Case');

$(document).ready(function () {
  if ($("#routineoverview").length > 0) {
    $("#routineoverview .group[data-groupidx=" + $("#CurrGroup").val() + "]").addClass("currgroup");
    $("#routineoverview .arrowcontainer").css("height", $("#routineoverview .mainprocess").css("height"));
    var groupRelativePos = (Number($("#CurrGroup").val()) - 1) * 190;
    $("#routineoverview .arrowcontainer").css("background-position", "8px " + (groupRelativePos + 13) + "px");
    $("#routineoverview .currphase").css("top", (groupRelativePos == 0 ? 0 : (groupRelativePos - 20)) + "px");
    $("#routineoverview .group[data-node-id]").on("click", function () {
      window.location = "/Teachings/CommonNode/Guide/" + $(this).attr("data-node-id");
    })
    $("#routineoverview").on("click", "button[data-act=go]", function () {
      $("#navbar button[data-step=next]").click();
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

  $("#fillerstepper").css("left", $(".maincont").offset().left);
  $("#fillerstepper").show();
})

var teachingPackMng = {};

module.exports = teachingPackMng;