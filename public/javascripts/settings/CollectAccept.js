$(document).ready(function () {
    $('#frmCaseBasic .date').datetimepicker({ language: 'zh-CN', pickTime: false }).on('dp.change dp.show', function (e) {
        $('#frmCaseBasic')
            .data('bootstrapValidator')
            .updateStatus($(this).find("input").prop("name"), 'NOT_VALIDATED', null)
            .validateField($(this).find("input").prop("name"));
    });
    $('#frmCaseBasic').bootstrapValidator({
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            CollectDate: {
                validators: {
                    notEmpty: {
                        message: '请填写日期'
                    },
                    date: {
                        format: 'YYYY-MM-DD',
                        message: '日期格式不正确'
                    }
                }
            },
            AcceptDate: {
                validators: {
                    notEmpty: {
                        message: '请填写日期'
                    },
                    date: {
                        format: 'YYYY-MM-DD',
                        message: '日期格式不正确'
                    }
                }
            },
            RemitterName: {
                container: "#h_RemitterName",
                validators: {
                    notEmpty: {
                        message: '请填写出票人'
                    }
                }
            },
            RemitterAcc: {
                container: "#h_RemitterAcc",
                validators: {
                    notEmpty: {
                        message: '请填写出票人账号'
                    }
                }
            },
            RemitterBank: {                
                validators: {
                    notEmpty: {
                        message: '请填写出票人银行'
                    }
                }
            },
            PayeeName: {
                container: "#h_PayeeName",
                validators: {
                    notEmpty: {
                        message: '请填写收款人'
                    }
                }
            },
            PayeeAcc: {
                container: "#h_PayeeAcc",
                validators: {
                    notEmpty: {
                        message: '请填写收款人账号'
                    }
                }
            },
            PayeeBank: {              
                validators: {
                    notEmpty: {
                        message: '请填写收款人银行'
                    }
                }
            },
            MoneyAmount: {
                validators: {
                    container: "#h_MoneyAmount",
                    notEmpty: {
                        message: '请填写金额'
                    },
                    between: {
                        min: 0,
                        max: 100000000,
                        message: '金额必须在 0 与 100,000,000之间'
                    }
                }
            }
        }
    });
    $("#frmCaseBasic").on("click", "button[data-act=save]", function () {
        $("#frmCaseBasic").bootstrapValidator('validate');
        if (!$("#frmCaseBasic").data('bootstrapValidator').isValid())
            return;
        siteUtils.prepareSave($("#frmCaseBasic button[data-act=save]"));

        var resultData = new Object();
        resultData.info = siteUtils.SerializeFormObjs($("#frmCaseBasic :input").serializeArray());
        $.ajax({
            type: "POST",
            url: "/Settings/SpecialNode/Save" + $(".tabcontainer div[data-target=basic]").attr("data-rtag") + "Data",
            data: JSON.stringify(resultData),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function () {                
                siteUtils.showSaveSuccess($("#frmCaseBasic button[data-act=save]"));
            },
            error: function (err) {
                
            }
        });
      
    });
});