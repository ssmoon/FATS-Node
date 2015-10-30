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
            AccountCreateTime: {
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
            DepositTime: {
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
            WithdrawTime: {
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
            InterestTime: {
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
            BankName: {
                container: "#h_BankName",
                validators: {
                    notEmpty: {
                        message: '请填写银行名称'
                    }
                }
            },          
            EntryAmount: {
                validators: {
                    container: "#h_EntryAmount",
                    notEmpty: {
                        message: '请填写金额'
                    },
                    between: {
                        min: 0,
                        max: 100000000,
                        message: '金额必须在 0 与 100,000,000之间'
                    }
                }
            },
            InterestAmount: {
                validators: {
                    container: "#h_InterestAmount",
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
            url: "/Settings/SpecialNode/SaveIndividualSavingData",
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