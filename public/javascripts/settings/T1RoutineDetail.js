$(document).ready(function () {
    $('#frmCaseInfo').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            CaseName: {
                validators: {
                    notEmpty: {
                        message: '名称不可以为空'
                    }
                }
            },
            CaseText: {
                validators: {
                    notEmpty: {
                        message: '案例的描述文字不可以为空'
                    }
                }
            }
        }
    });
    $("#frmCaseInfo").on("click", "button[data-act=savecase]", function () {
        $("#frmCaseInfo").bootstrapValidator('validate');
        if (!$("#frmCaseInfo").data('bootstrapValidator').isValid())
            return;
        siteUtils.prepareSave($("#frmCaseInfo button[data-act=savecase]"));

        var dataCarrier = new Object();
        dataCarrier.caseText = $("#CaseText").val();
        dataCarrier.caseName = jQuery.trim($("#CaseName").val());
        dataCarrier.tchRoutineID = $("#hidTchRoutineID").val();

        $.ajax({
            type: "POST",
            url: "/Settings/Teaching1Setting/UpdateCase",
            data: JSON.stringify(dataCarrier),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function () {
                siteUtils.showSaveSuccess($("#frmCaseInfo button[data-act=savecase]"));
            },
            error: function (ex) {

            }
        });
    });
    $(".tabcontainer div[data-target=text]").on("click", "button[data-act=save]", function () {       
        siteUtils.prepareSave($(".tabcontainer div[data-target=text] button[data-act=savecase]"));

        var dataCarrier = new Object();
        dataCarrier.textList = new Array();

        $(".tabcontainer div[data-target=text] .form-group").each(function () {
            dataCarrier.textList.push($(this).attr("data-key") + "~" + $(this).find("[data-type=text]").val() + "~" + $(this).find("[data-type=intro]").val());
        })

        dataCarrier.tchRoutineID = $("#hidTchRoutineID").val();
        
        $.ajax({
            type: "POST",
            url: "/Settings/Teaching1Setting/UpdateGroupText",
            data: JSON.stringify(dataCarrier),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function () {
                siteUtils.showSaveSuccess($(".tabcontainer div[data-target=text] button[data-act=save]"));
            },
            error: function (ex) {

            }
        });
    });
    $("#subdatanav").on("click", "a", function () {
        if ($(this).hasClass("active"))
            return;
        $("#subdatanav a").parent().removeClass("active");
        $(this).parent().addClass("active");
        $(".subdata").hide();
        $(".subdata[data-target=" + $(this).attr("data-target") + "]").show();
    });

    routineDataMng.tchRoutineID = $("#hidTchRoutineID").val();
    routineDataMng.initSubjectEvent();
    routineDataMng.initSubjectData();
    routineDataMng.initDetailedLedgerEvent();
    routineDataMng.initDetailedLedgerData();
    routineDataMng.initGeneralLedgerEvent();
    routineDataMng.initGeneralLedgerData();
    routineDataMng.initCustomerLedgerEvent();
    routineDataMng.initCustomerLedgerData();
    routineDataMng.initCashJournalEvent();
    routineDataMng.initCashJournalData();
    routineDataMng.initOuterSubjectEvent();
    routineDataMng.initOuterSubjectData();
})

var routineDataMng = {
    tchRoutineID: "",
    subjectTable: null,
    detailedLedgerTable: null,
    generalLedgerTable: null,
    customerLedgerTable: null,
    currentRowData: null,

    initSubjectEvent: function () {
        $('#frmSubjectItem').bootstrapValidator({
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                SubjectName: {
                    container: "#h_SubjectName",
                    validators: {
                        notEmpty: {
                            message: '请填写科目名称'
                        }
                    }
                },
                Amount: {
                    validators: {
                        container: "#h_Amount",
                        notEmpty: {
                            message: '请填写金额'
                        },
                        between: {
                            min: 0,
                            max: 1000000000,
                            message: '金额必须在 0 与 1,000,000,000之间'
                        }
                    }
                }
            }
        });
        $('#pop_SubjectItem').on("click", "button[data-act=save]", function () {
            $("#frmSubjectItem").bootstrapValidator('validate');
            if (!$("#frmSubjectItem").data('bootstrapValidator').isValid())
                return;
            siteUtils.prepareSave($("#frmSubjectItem button[data-act=save]"));

            routineDataMng.currentRowData = siteUtils.SerializeFormObjsFrom($("#frmSubjectItem :input").serializeArray(), routineDataMng.currentRowData);
            var dataCarrier = new Object();
            dataCarrier.subject = routineDataMng.currentRowData;
            $.ajax({
                type: "POST",
                url: "/Settings/CommonNode/UpdateSubjectItem",
                data: JSON.stringify(dataCarrier),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function () {
                    siteUtils.showSaveSuccess($("#frmSubjectItem button[data-act=save]"));
                    setTimeout(function () {
                        $("#pop_SubjectItem").modal('hide');
                        routineDataMng.subjectTable.fnReloadAjax();
                    }, 1000);
                },
                error: function (ex) {

                }
            });
        });
    },

    initSubjectData: function () {
        routineDataMng.subjectTable = $('#subjectitemlist').dataTable({
            "bSort": false,
            "bInfo": false,
            "bFilter": false,
            "bLengthChange": false,
            "bPaginate": false,
            "bProcessing": true,
            "sAjaxSource": "/Settings/CommonNode/ListSubjectItem",
            "fnServerData": function (sSource, aoData, fnCallback) {
                aoData = { tRoutineID: routineDataMng.tchRoutineID },
                $.ajax({
                    "dataType": 'json',
                    "type": "POST",
                    "url": sSource,
                    "data": aoData,
                    "success": fnCallback
                })
            },
            "aoColumns": [
                { "sTitle": "所属步骤", "mData": "RoutineDesc" },
                {
                    "sTitle": "科目名称", "mData": "SubjectName", "mRender": function (data, type, row) {
                        if ((data == "") || (data == null))
                            return "<span class='text-danger'>(未设置)</span>";
                        else return data;
                    }
                },
                { "sTitle": "下级科目", "mData": "SubSubject" },
                {
                    "sTitle": "操作", "mData": "Row_ID", "mRender": function (data, type, row) {
                        return "<a href='javascript:void(0)' data-act='edit'>编辑</a>";
                    }
                }
            ],
            "fnDrawCallback": function (oSettings) {
                $("#subjectitemlist a[data-act=edit]").off().on("click", function () {
                    var aPos = routineDataMng.subjectTable.fnGetPosition($(this).closest('tr').get(0));
                    routineDataMng.currentRowData = routineDataMng.subjectTable.fnGetData(aPos);
                    $('#pop_SubjectItem').modal('show');
                    siteUtils.TryAutoFillControl(routineDataMng.currentRowData, "pop_SubjectItem");
                })
            }
        });
    },

    initDetailedLedgerEvent: function () {
        $('#frmDetailedLedger .date').datetimepicker({ language: 'zh-CN', pickTime: false }).on('dp.change dp.show', function (e) {
            $('#frmDetailedLedger')
                .data('bootstrapValidator')
                .updateStatus($(this).find("input").prop("name"), 'NOT_VALIDATED', null)
                .validateField($(this).find("input").prop("name"));
        });
        $('#frmDetailedLedger').bootstrapValidator({
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                SubjectName: {
                    container: "#h_dl_SubjectName",
                    validators: {
                        notEmpty: {
                            message: '请填写科目名称'
                        }
                    }
                },
                BalanceSum: {
                    validators: {
                        container: "#h_dl_BalanceSum",
                        notEmpty: {
                            message: '请填写金额'
                        },
                        between: {
                            min: 0,
                            max: 1000000000,
                            message: '金额必须在 0 与 1,000,000,000之间'
                        }
                    }
                },
                DebitSum: {
                    validators: {
                        container: "#h_dl_DebitSum",
                        notEmpty: {
                            message: '请填写金额'
                        },
                        between: {
                            min: 0,
                            max: 1000000000,
                            message: '金额必须在 0 与 1,000,000,000之间'
                        }
                    }
                },
                CreditSum: {
                    validators: {
                        container: "#h_dl_CreditSum",
                        notEmpty: {
                            message: '请填写金额'
                        },
                        between: {
                            min: 0,
                            max: 1000000000,
                            message: '金额必须在 0 与 1,000,000,000之间'
                        }
                    }
                },
                FinalSum: {
                    validators: {
                        container: "#h_dl_FinalSum",
                        notEmpty: {
                            message: '请填写金额'
                        },
                        between: {
                            min: 0,
                            max: 1000000000,
                            message: '金额必须在 0 与 1,000,000,000之间'
                        }
                    }
                }
            }
        });
        $('#pop_DetailedLedger').on("click", "button[data-act=save]", function () {
            $("#frmDetailedLedger").bootstrapValidator('validate');
            if (!$("#frmDetailedLedger").data('bootstrapValidator').isValid())
                return;
            siteUtils.prepareSave($("#frmDetailedLedger button[data-act=save]"));

            routineDataMng.currentRowData = siteUtils.SerializeFormObjsFrom($("#frmDetailedLedger :input").serializeArray(), routineDataMng.currentRowData);
            var dataCarrier = new Object();
            dataCarrier.info = routineDataMng.currentRowData;
            $.ajax({
                type: "POST",
                url: "/Settings/CommonNode/DetailedLedger_Update",
                data: JSON.stringify(dataCarrier),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function () {
                    siteUtils.showSaveSuccess($("#frmDetailedLedger button[data-act=save]"));
                    setTimeout(function () {
                        $("#pop_DetailedLedger").modal('hide');
                        routineDataMng.detailedLedgerTable.fnReloadAjax();
                    }, 1000);
                },
                error: function (ex) {

                }
            });
        });
    },

    initDetailedLedgerData: function () {
        routineDataMng.detailedLedgerTable = $('#detailedledgerlist').dataTable({
            "bSort": false,
            "bInfo": false,
            "bFilter": false,
            "bLengthChange": false,
            "bPaginate": false,
            "bProcessing": true,
            "sAjaxSource": "/Settings/CommonNode/DetailedLedger_List",
            "fnServerData": function (sSource, aoData, fnCallback) {
                aoData = { tRoutineID: routineDataMng.tchRoutineID },
                $.ajax({
                    "dataType": 'json',
                    "type": "POST",
                    "url": sSource,
                    "data": aoData,
                    "success": fnCallback
                })
            },
            "aoColumns": [
                { "sTitle": "所属步骤", "mData": "RoutineDesc" },
                {
                    "sTitle": "科目名称", "mData": "SubjectName", "mRender": function (data, type, row) {
                        if ((data == "") || (data == null))
                            return "<span class='text-danger'>(未设置)</span>";
                        else return data;
                    }
                },
                { "sTitle": "银行名称", "mData": "BankName" },
                { "sTitle": "借方发生", "mData": "DebitSum" },
                { "sTitle": "贷方发生", "mData": "CreditSum" },
                {
                    "sTitle": "操作", "mData": "Row_ID", "mRender": function (data, type, row) {
                        return "<a href='javascript:void(0)' data-act='edit'>编辑</a>";
                    }
                }
            ],
            "fnDrawCallback": function (oSettings) {
                $("#detailedledgerlist a[data-act=edit]").off().on("click", function () {
                    var aPos = routineDataMng.detailedLedgerTable.fnGetPosition($(this).closest('tr').get(0));
                    routineDataMng.currentRowData = routineDataMng.detailedLedgerTable.fnGetData(aPos);
                    $('#pop_DetailedLedger').modal('show');
                    siteUtils.TryAutoFillControl(routineDataMng.currentRowData, "pop_DetailedLedger");
                })
            }
        });
    },

    initGeneralLedgerEvent: function () {
    $('#frmGeneralLedger .date').datetimepicker({ language: 'zh-CN', pickTime: false }).on('dp.change dp.show', function (e) {
        $('#frmGeneralLedger')
            .data('bootstrapValidator')
            .updateStatus($(this).find("input").prop("name"), 'NOT_VALIDATED', null)
            .validateField($(this).find("input").prop("name"));
    });
    $('#frmGeneralLedger').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            SubjectName: {
                container: "#h_gl_SubjectName",
                validators: {
                    notEmpty: {
                        message: '请填写科目名称'
                    }
                }
            },
            BalanceSum: {
                validators: {
                    container: "#h_gl_BalanceSum",
                    notEmpty: {
                        message: '请填写金额'
                    },
                    between: {
                        min: 0,
                        max: 1000000000,
                        message: '金额必须在 0 与 1,000,000,000之间'
                    }
                }
            },
            DebitSum: {
                validators: {
                    container: "#h_gl_DebitSum",
                    notEmpty: {
                        message: '请填写金额'
                    },
                    between: {
                        min: 0,
                        max: 1000000000,
                        message: '金额必须在 0 与 1,000,000,000之间'
                    }
                }
            },
            CreditSum: {
                validators: {
                    container: "#h_gl_CreditSum",
                    notEmpty: {
                        message: '请填写金额'
                    },
                    between: {
                        min: 0,
                        max: 1000000000,
                        message: '金额必须在 0 与 1,000,000,000之间'
                    }
                }
            },
            FinalSum: {
                validators: {
                    container: "#h_gl_FinalSum",
                    notEmpty: {
                        message: '请填写金额'
                    },
                    between: {
                        min: 0,
                        max: 1000000000,
                        message: '金额必须在 0 与 1,000,000,000之间'
                    }
                }
            }
        }
    });
    $('#pop_GeneralLedger').on("click", "button[data-act=save]", function () {
        $("#frmGeneralLedger").bootstrapValidator('validate');
        if (!$("#frmGeneralLedger").data('bootstrapValidator').isValid())
            return;
        siteUtils.prepareSave($("#frmGeneralLedger button[data-act=save]"));

        routineDataMng.currentRowData = siteUtils.SerializeFormObjsFrom($("#frmGeneralLedger :input").serializeArray(), routineDataMng.currentRowData);
        var dataCarrier = new Object();
        dataCarrier.info = routineDataMng.currentRowData;
        $.ajax({
            type: "POST",
            url: "/Settings/CommonNode/GeneralLedger_Update",
            data: JSON.stringify(dataCarrier),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function () {
                siteUtils.showSaveSuccess($("#frmGeneralLedger button[data-act=save]"));
                setTimeout(function () {
                    $("#pop_GeneralLedger").modal('hide');
                    routineDataMng.generalLedgerTable.fnReloadAjax();
                }, 1000);
            },
            error: function (ex) {

            }
        });
    });
},

    initGeneralLedgerData: function () {
        routineDataMng.generalLedgerTable = $('#generalledgerlist').dataTable({
        "bSort": false,
        "bInfo": false,
        "bFilter": false,
        "bLengthChange": false,
        "bPaginate": false,
        "bProcessing": true,
        "sAjaxSource": "/Settings/CommonNode/GeneralLedger_List",
        "fnServerData": function (sSource, aoData, fnCallback) {
            aoData = { tRoutineID: routineDataMng.tchRoutineID },
            $.ajax({
                "dataType": 'json',
                "type": "POST",
                "url": sSource,
                "data": aoData,
                "success": fnCallback
            })
        },
        "aoColumns": [
            { "sTitle": "所属步骤", "mData": "RoutineDesc" },
            {
                "sTitle": "科目名称", "mData": "SubjectName", "mRender": function (data, type, row) {
                    if ((data == "") || (data == null))
                        return "<span class='text-danger'>(未设置)</span>";
                    else return data;
                }
            },
            { "sTitle": "银行名称", "mData": "BankName" },
            { "sTitle": "借方发生", "mData": "DebitSum" },
            { "sTitle": "贷方发生", "mData": "CreditSum" },
            {
                "sTitle": "操作", "mData": "Row_ID", "mRender": function (data, type, row) {
                    return "<a href='javascript:void(0)' data-act='edit'>编辑</a>";
                }
            }
        ],
        "fnDrawCallback": function (oSettings) {
            $("#generalledgerlist a[data-act=edit]").off().on("click", function () {
                var aPos = routineDataMng.generalLedgerTable.fnGetPosition($(this).closest('tr').get(0));
                routineDataMng.currentRowData = routineDataMng.generalLedgerTable.fnGetData(aPos);
                $('#pop_GeneralLedger').modal('show');
                siteUtils.TryAutoFillControl(routineDataMng.currentRowData, "pop_GeneralLedger");
            })
        }
    });
    },


    initCustomerLedgerEvent: function () {
        $('#frmCustomerLedger .date').datetimepicker({ language: 'zh-CN', pickTime: false }).on('dp.change dp.show', function (e) {
            $('#frmCustomerLedger')
                .data('bootstrapValidator')
                .updateStatus($(this).find("input").prop("name"), 'NOT_VALIDATED', null)
                .validateField($(this).find("input").prop("name"));
        });
        $('#frmCustomerLedger').bootstrapValidator({
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                SubjectName: {
                    container: "#h_cl_SubjectName",
                    validators: {
                        notEmpty: {
                            message: '请填写科目名称'
                        }
                    }
                },
                BalanceSum: {
                    validators: {
                        container: "#h_cl_BalanceSum",
                        notEmpty: {
                            message: '请填写金额'
                        },
                        between: {
                            min: 0,
                            max: 1000000000,
                            message: '金额必须在 0 与 1,000,000,000之间'
                        }
                    }
                },
                DebitSum: {
                    validators: {
                        container: "#h_cl_DebitSum",
                        notEmpty: {
                            message: '请填写金额'
                        },
                        between: {
                            min: 0,
                            max: 1000000000,
                            message: '金额必须在 0 与 1,000,000,000之间'
                        }
                    }
                },
                CreditSum: {
                    validators: {
                        container: "#h_cl_CreditSum",
                        notEmpty: {
                            message: '请填写金额'
                        },
                        between: {
                            min: 0,
                            max: 1000000000,
                            message: '金额必须在 0 与 1,000,000,000之间'
                        }
                    }
                },
                FinalSum: {
                    validators: {
                        container: "#h_cl_FinalSum",
                        notEmpty: {
                            message: '请填写金额'
                        },
                        between: {
                            min: 0,
                            max: 1000000000,
                            message: '金额必须在 0 与 1,000,000,000之间'
                        }
                    }
                }
            }
        });
        $('#pop_CustomerLedger').on("click", "button[data-act=save]", function () {
            $("#frmCustomerLedger").bootstrapValidator('validate');
            if (!$("#frmCustomerLedger").data('bootstrapValidator').isValid())
                return;
            siteUtils.prepareSave($("#frmCustomerLedger button[data-act=save]"));

            routineDataMng.currentRowData = siteUtils.SerializeFormObjsFrom($("#frmCustomerLedger :input").serializeArray(), routineDataMng.currentRowData);
            var dataCarrier = new Object();
            dataCarrier.info = routineDataMng.currentRowData;
            $.ajax({
                type: "POST",
                url: "/Settings/CommonNode/CustomerLedger_Update",
                data: JSON.stringify(dataCarrier),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function () {
                    siteUtils.showSaveSuccess($("#frmCustomerLedger button[data-act=save]"));
                    setTimeout(function () {
                        $("#pop_CustomerLedger").modal('hide');
                        routineDataMng.customerLedgerTable.fnReloadAjax();
                    }, 1000);
                },
                error: function (ex) {

                }
            });
        });
    },

    initCustomerLedgerData: function () {
        routineDataMng.customerLedgerTable = $('#customerledgerlist').dataTable({
            "bSort": false,
            "bInfo": false,
            "bFilter": false,
            "bLengthChange": false,
            "bPaginate": false,
            "bProcessing": true,
            "sAjaxSource": "/Settings/CommonNode/CustomerLedger_List",
            "fnServerData": function (sSource, aoData, fnCallback) {
                aoData = { tRoutineID: routineDataMng.tchRoutineID },
                $.ajax({
                    "dataType": 'json',
                    "type": "POST",
                    "url": sSource,
                    "data": aoData,
                    "success": fnCallback
                })
            },
            "aoColumns": [
                { "sTitle": "所属步骤", "mData": "RoutineDesc" },
                {
                    "sTitle": "科目名称", "mData": "SubjectName", "mRender": function (data, type, row) {
                        if ((data == "") || (data == null))
                            return "<span class='text-danger'>(未设置)</span>";
                        else return data;
                    }
                },
                { "sTitle": "客户名称", "mData": "CustomerName" },
                { "sTitle": "银行名称", "mData": "BankName" },
                { "sTitle": "借方发生", "mData": "DebitSum" },
                { "sTitle": "贷方发生", "mData": "CreditSum" },
                {
                    "sTitle": "操作", "mData": "Row_ID", "mRender": function (data, type, row) {
                        return "<a href='javascript:void(0)' data-act='edit'>编辑</a>";
                    }
                }
            ],
            "fnDrawCallback": function (oSettings) {
                $("#customerledgerlist a[data-act=edit]").off().on("click", function () {
                    var aPos = routineDataMng.customerLedgerTable.fnGetPosition($(this).closest('tr').get(0));
                    routineDataMng.currentRowData = routineDataMng.customerLedgerTable.fnGetData(aPos);
                    $('#pop_CustomerLedger').modal('show');
                    siteUtils.TryAutoFillControl(routineDataMng.currentRowData, "pop_CustomerLedger");
                })
            }
        });
    },

    initCashJournalEvent: function () {
        $('#frmCashJournal .date').datetimepicker({ language: 'zh-CN', pickTime: false }).on('dp.change dp.show', function (e) {
            $('#frmCashJournal')
                .data('bootstrapValidator')
                .updateStatus($(this).find("input").prop("name"), 'NOT_VALIDATED', null)
                .validateField($(this).find("input").prop("name"));
        });
        $('#frmCashJournal').bootstrapValidator({
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                CounterSubject: {
                    container: "#h_cj_CounterSubject",
                    validators: {
                        notEmpty: {
                            message: '请填写对方科目名称'
                        }
                    }
                },
                MoneyAmount: {
                    validators: {
                        container: "#h_cj_MoneyAmount",
                        notEmpty: {
                            message: '请填写金额'
                        },
                        between: {
                            min: 0,
                            max: 1000000000,
                            message: '金额必须在 0 与 1,000,000,000之间'
                        }
                    }
                }
            }
        });
        $('#pop_CashJournal').on("click", "button[data-act=save]", function () {
            $("#frmCashJournal").bootstrapValidator('validate');
            if (!$("#frmCashJournal").data('bootstrapValidator').isValid())
                return;
            siteUtils.prepareSave($("#frmCashJournal button[data-act=save]"));

            routineDataMng.currentRowData = siteUtils.SerializeFormObjsFrom($("#frmCashJournal :input").serializeArray(), routineDataMng.currentRowData);
            var dataCarrier = new Object();
            dataCarrier.info = routineDataMng.currentRowData;
            $.ajax({
                type: "POST",
                url: "/Settings/CommonNode/CashJournal_Update",
                data: JSON.stringify(dataCarrier),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function () {
                    siteUtils.showSaveSuccess($("#frmCashJournal button[data-act=save]"));
                    setTimeout(function () {
                        $("#pop_CashJournal").modal('hide');
                        routineDataMng.cashJournalTable.fnReloadAjax();
                    }, 1000);
                },
                error: function (ex) {

                }
            });
        });
    },

    initCashJournalData: function () {
        routineDataMng.cashJournalTable = $('#cashjournallist').dataTable({
            "bSort": false,
            "bInfo": false,
            "bFilter": false,
            "bLengthChange": false,
            "bPaginate": false,
            "bProcessing": true,
            "sAjaxSource": "/Settings/CommonNode/CashJournal_List",
            "fnServerData": function (sSource, aoData, fnCallback) {
                aoData = { tRoutineID: routineDataMng.tchRoutineID },
                $.ajax({
                    "dataType": 'json',
                    "type": "POST",
                    "url": sSource,
                    "data": aoData,
                    "success": fnCallback
                })
            },
            "aoColumns": [
                { "sTitle": "所属步骤", "mData": "RoutineDesc" },
                { "sTitle": "账目类别", "mData": "CashOrient" },
                {
                    "sTitle": "科目名称", "mData": "CounterSubject", "mRender": function (data, type, row) {
                        if ((data == "") || (data == null))
                            return "<span class='text-danger'>(未设置)</span>";
                        else return data;
                    }
                },                
                { "sTitle": "银行名称", "mData": "BankName" },
                { "sTitle": "金额", "mData": "MoneyAmount" },                
                {
                    "sTitle": "操作", "mData": "Row_ID", "mRender": function (data, type, row) {
                        return "<a href='javascript:void(0)' data-act='edit'>编辑</a>";
                    }
                }
            ],
            "fnDrawCallback": function (oSettings) {
                $("#cashjournallist a[data-act=edit]").off().on("click", function () {
                    var aPos = routineDataMng.cashJournalTable.fnGetPosition($(this).closest('tr').get(0));
                    routineDataMng.currentRowData = routineDataMng.cashJournalTable.fnGetData(aPos);
                    $('#pop_CashJournal').modal('show');
                    siteUtils.TryAutoFillControl(routineDataMng.currentRowData, "pop_CashJournal");
                })
            }
        });
    },

    initOuterSubjectEvent: function () {
        $('#frmOuterSubject .date').datetimepicker({ language: 'zh-CN', pickTime: false }).on('dp.change dp.show', function (e) {
            $('#frmOuterSubject')
                .data('bootstrapValidator')
                .updateStatus($(this).find("input").prop("name"), 'NOT_VALIDATED', null)
                .validateField($(this).find("input").prop("name"));
        });
        $('#frmOuterSubject').bootstrapValidator({
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                SubjectName: {
                    container: "#h_os_SubjectName",
                    validators: {
                        notEmpty: {
                            message: '请填写对方科目名称'
                        }
                    }
                },
                MoneyAmount: {
                    validators: {
                        container: "#h_os_MoneyAmount",
                        notEmpty: {
                            message: '请填写金额'
                        },
                        between: {
                            min: 0,
                            max: 1000000000,
                            message: '金额必须在 0 与 1,000,000,000之间'
                        }
                    }
                }
            }
        });
        $('#pop_OuterSubject').on("click", "button[data-act=save]", function () {
            $("#frmOuterSubject").bootstrapValidator('validate');
            if (!$("#frmOuterSubject").data('bootstrapValidator').isValid())
                return;
            siteUtils.prepareSave($("#frmOuterSubject button[data-act=save]"));

            routineDataMng.currentRowData = siteUtils.SerializeFormObjsFrom($("#frmOuterSubject :input").serializeArray(), routineDataMng.currentRowData);
            var dataCarrier = new Object();
            dataCarrier.info = routineDataMng.currentRowData;
            $.ajax({
                type: "POST",
                url: "/Settings/CommonNode/OuterSubject_Update",
                data: JSON.stringify(dataCarrier),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function () {
                    siteUtils.showSaveSuccess($("#frmOuterSubject button[data-act=save]"));
                    setTimeout(function () {
                        $("#pop_OuterSubject").modal('hide');
                        routineDataMng.outerSubjectTable.fnReloadAjax();
                    }, 1000);
                },
                error: function (ex) {

                }
            });
        });
    },

    initOuterSubjectData: function () {
        routineDataMng.outerSubjectTable = $('#outersubjectlist').dataTable({
            "bSort": false,
            "bInfo": false,
            "bFilter": false,
            "bLengthChange": false,
            "bPaginate": false,
            "bProcessing": true,
            "sAjaxSource": "/Settings/CommonNode/OuterSubject_List",
            "fnServerData": function (sSource, aoData, fnCallback) {
                aoData = { tRoutineID: routineDataMng.tchRoutineID },
                $.ajax({
                    "dataType": 'json',
                    "type": "POST",
                    "url": sSource,
                    "data": aoData,
                    "success": fnCallback
                })
            },
            "aoColumns": [
                { "sTitle": "所属步骤", "mData": "RoutineDesc" },               
                {
                    "sTitle": "科目名称", "mData": "SubjectName", "mRender": function (data, type, row) {
                        if ((data == "") || (data == null))
                            return "<span class='text-danger'>(未设置)</span>";
                        else return data;
                    }
                },
                { "sTitle": "银行名称", "mData": "BankName" },
                { "sTitle": "金额", "mData": "MoneyAmount" },
                {
                    "sTitle": "操作", "mData": "Row_ID", "mRender": function (data, type, row) {
                        return "<a href='javascript:void(0)' data-act='edit'>编辑</a>";
                    }
                }
            ],
            "fnDrawCallback": function (oSettings) {
                $("#outersubjectlist a[data-act=edit]").off().on("click", function () {
                    var aPos = routineDataMng.outerSubjectTable.fnGetPosition($(this).closest('tr').get(0));
                    routineDataMng.currentRowData = routineDataMng.outerSubjectTable.fnGetData(aPos);
                    $('#pop_OuterSubject').modal('show');
                    siteUtils.TryAutoFillControl(routineDataMng.currentRowData, "pop_OuterSubject");
                })
            }
        });
    },

}