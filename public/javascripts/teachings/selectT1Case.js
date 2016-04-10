var caseSelectionMgr = {
  caseTable: null,
  studiedTable: null,
  tableData: null,
  selectedRID: "",

  initPageEvent: function () {
    $("#accordion").on("click", "a.list-group-item", function () {
      if ($(this).hasClass("active"))
        return;
      $("#casearea .currname").html($(this).html());
      caseSelectionMgr.selectedRID = $(this).attr("data-dbid");
      caseSelectionMgr.tableData = { tmpRoutineID: $(this).attr("data-dbid") };
      caseSelectionMgr.reloadTableData();
      $("#accordion a.list-group-item").removeClass("active");
      $(this).addClass("active");
    });
    $("#accordion a.list-group-item:eq(0)").click();
  },

  initCaseTable: function () {
    caseSelectionMgr.caseTable = $('#caselist').dataTable({
      "bSort": false,
      "bInfo": false,
      "bFilter": false,
      "bLengthChange": false,
      "bPaginate": false,
      "bProcessing": true,
      "sAjaxSource": "/Teaching/Navigator/AllRoutine",
      "fnServerData": function (sSource, aoData, fnCallback) {
        aoData = caseSelectionMgr.tableData,
        $.ajax({
          "dataType": 'json',
          "type": "POST",
          "url": sSource,
          "data": aoData,
          "success": fnCallback
        })
      },
      "aoColumns": [
        { "sTitle": "案例名称", "mData": "CaseName" },
        {
          "sTitle": "操作", "mData": "Row_ID", "mRender": function (data, type, row) {
            return "<a href='javascript:void(0)' data-act='go'>开始</a>";
          }
        }
      ],
      "fnDrawCallback": function (oSettings) {
        $("#caselist a[data-act=go]").off().on("click", function () {
          $('#pop_LoadingCase').modal('show');
          var aPos = caseSelectionMgr.caseTable.fnGetPosition($(this).closest('tr').get(0));
          var routineID = caseSelectionMgr.caseTable.fnGetData(aPos).Row_ID;
          $.ajax({
            type: "POST",
            url: '/Teaching/Navigator/Start',
            data: '{"tchRoutineID": "' + routineID + '" }',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
              $('#pop_LoadingCase .modal-body').html("系统已为你准备好了案例，跳转页面中...");
              window.location = '/Teaching/' + result;
            },
            error: function (e) {
              HidePopLoading();
            }
          });
        })
      }
    });
  },

  reloadTableData: function () {
    caseSelectionMgr.caseTable.fnReloadAjax();
  //  caseSelectionMgr.studiedTable.fnReloadAjax();
  },


  initStudiedTable: function () {
    caseSelectionMgr.studiedTable = $('#studiedlist').dataTable({
      "bSort": false,
      "bInfo": false,
      "bFilter": false,
      "bLengthChange": false,
      "bPaginate": false,
      "bProcessing": true,
      "sAjaxSource": "/Teaching/Navigator/Allroutine",
      "fnServerData": function (sSource, aoData, fnCallback) {
        $.ajax({
          "dataType": 'json',
          "type": "POST",
          "url": sSource,
          "data": aoData,
          "success": fnCallback
        })
      },
      "aoColumns": [
        { "sTitle": "案例名称", "mData": "CaseName" },
        {
          "sTitle": "操作", "mData": "Row_ID", "mRender": function (data, type, row) {
            return "<a href='javascript:void(0)' data-act='continue'>继续</a>&nbsp;&nbsp;&nbsp;<a href='javascript:void(0)' data-act='reset'>重新开始</a>";
          }
        }
      ],
      "fnDrawCallback": function (oSettings) {
        $("#studiedlist a[data-act=continue]").off().on("click", function () {
          $('#pop_LoadingCase').modal('show');
          var aPos = caseSelectionMgr.studiedTable.fnGetPosition($(this).closest('tr').get(0));
          var studiedData = caseSelectionMgr.studiedTable.fnGetData(aPos);
          window.location = '/Teachings/' + studiedData.NodeTag + "/" + studiedData.NodeType + "/" + studiedData.TchNodeID;
        })
        $("#studiedlist a[data-act=reset]").off().on("click", function () {
          $('#pop_LoadingCase').modal('show');
          var aPos = caseSelectionMgr.studiedTable.fnGetPosition($(this).closest('tr').get(0));
          var routineID = caseSelectionMgr.studiedTable.fnGetData(aPos).Row_ID;
          $.ajax({
            type: "POST",
            url: '/Teachings/TeachingInit/ResetRoutine',
            data: '{"teachingRoutineID": "' + routineID + '" }',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
              $('#pop_LoadingCase .modal-body').html("系统已为你准备好了案例，跳转页面中...");
              window.location = '/Teachings/' + result;
            },
            error: function (e) {
              HidePopLoading();
            }
          });
        })
      }
    });
  }
}

module.exports = caseSelectionMgr;