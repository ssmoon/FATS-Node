$(document).ready(function () {
    caseSettingMgr.initTable();
    
    $("#accordion").on("click", "a.list-group-item", function () {
        if ($(this).hasClass("active"))
            return;
        $("#casearea .currname .namelabel").html($(this).html());
        caseSettingMgr.selectedRID = $(this).attr("data-dbid");
        caseSettingMgr.tableData = { tmpRoutineID: $(this).attr("data-dbid") };
        caseSettingMgr.reloadCaseTable();
        $("#accordion a.list-group-item").removeClass("active");
        $(this).addClass("active");
    });
    $("#accordion a.list-group-item:eq(0)").click();
    $('#frmNewCase').bootstrapValidator({    
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            n_CaseName: {
                validators: {
                    notEmpty: {
                        message: '名称不可以为空'
                    }
                }
            }
        }
    });
    $("#frmNewCase").on("click", "button[data-act=save]", function () {
        $("#frmNewCase").bootstrapValidator('validate');
        if (!$("#frmNewCase").data('bootstrapValidator').isValid())
            return;
        $(this).button('loading');
        var dataCarrier = new Object();
        dataCarrier.routine = new Object();
        dataCarrier.routine.CaseText = " ";
        dataCarrier.routine.CurrStatus = 0;
        dataCarrier.routine.CaseName = $("#frmNewCase input[name=n_CaseName]").val();
        dataCarrier.routine.TmpRoutineID = caseSettingMgr.selectedRID;
        $.ajax({
            type: "POST",
            url: "/Settings/Teaching1Setting/AppendCase",
            data: JSON.stringify(dataCarrier),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                $("#frmNewCase input[name=n_CaseName]").val("");
                $("#frmNewCase button[data-act=save]").button('reset');
                $("#pop_NewCase").modal('hide');
                caseSettingMgr.reloadCaseTable();
            },
            error: function (err) {

            }
        });
    });
})


var caseSettingMgr = {
    caseTable: null,
    tableData: null,
    selectedRID: "",

    initTable: function () {
        caseSettingMgr.caseTable = $('#caselist').dataTable({
            "bSort": false,
            "bInfo": false,
            "bFilter": false,
            "bLengthChange": false,
            "bPaginate": false,
            "bProcessing": true,           
            "sAjaxSource": "/Settings/Teaching1Setting/LoadCase",
            "fnServerData": function (sSource, aoData, fnCallback) {
                aoData= caseSettingMgr.tableData,
                $.ajax( {
                    "dataType": 'json',
                    "type": "POST",
                    "url": sSource,
                    "data": aoData,
                    "success": fnCallback
                } )
            },
            "aoColumns": [
                { "sTitle": "案例名称", "mData": "CaseName" },
                {
                    "sTitle": "状态", "mData": "CurrStatus", "mRender": function (data, type, row) {
                        if (data > 0)
                            return "<span class='text-success'>可用</span>";
                        else return "<span class='text-danger'>不可用</span>";
                    }
                },
                {
                    "sTitle": "操作", "mData": "Row_ID", "mRender": function (data, type, row) {
                        return "<a href='javascript:void(0)' data-act='edit'>编辑</a>&nbsp;&nbsp;&nbsp;<a href='javascript:void(0)' data-act='del'>删除</a>";
                    }
                }
            ],
            "fnDrawCallback": function (oSettings) {
                $("#caselist a[data-act=del]").unbind();
                $("#caselist a[data-act=del]").confirm({
                    title: "删除确认",
                    text: "真的要删除这个案例吗？删除后将无法恢复?",
                    confirm: function (button) {
                        var aPos = caseSettingMgr.caseTable.fnGetPosition(button.closest('tr').get(0));
                        var routineID = caseSettingMgr.caseTable.fnGetData(aPos).Row_ID;
                        caseSettingMgr.caseTable.fnDeleteRow(aPos);
                        $.ajax({
                            type: "POST",
                            url: "/Settings/Teaching1Setting/DeleteCase",
                            data: '{ "teachingRoutineID": "' + routineID + '" }',
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            success: function () {
                            },
                            error: function () {
                            }
                        });
                        
                    },
                    cancel: function (button) {
                        
                    },
                    confirmButton: "确定",
                    cancelButton: "取消"
                });
                $("#caselist a[data-act=edit]").off().on("click", function () {
                    var aPos = caseSettingMgr.caseTable.fnGetPosition($(this).closest('tr').get(0));
                    var routineID = caseSettingMgr.caseTable.fnGetData(aPos).Row_ID;
                    window.location = "/Settings/Teaching1Setting/Edit/" + routineID;
                })
            }
        });
    },

    reloadCaseTable: function () {
        caseSettingMgr.caseTable.fnReloadAjax();
    }
}
