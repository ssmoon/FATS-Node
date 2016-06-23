var siteUtils = require('../SiteShared');

$(document).ready(function () {
    $("#regarea button[data-act='gologin']").on("click", function () {
        window.location = "/User/Login";
    })
    $("#regarea button[data-act='reg']").on("click", function () {
        $("#regarea .alert").hide();
        var dataCarrier = {};
        dataCarrier.actCode = $("#regarea input[name='ActivationCode']").val();
        dataCarrier.userCode = $("#regarea input[name='UserCode']").val();
        dataCarrier.userName = $("#regarea input[name='UserName']").val();
        dataCarrier.userPwd = $("#regarea input[name='Password']").val();
        
        if (dataCarrier.userCode.length < 4) {
            $("#regarea .alert").fadeIn();
            $("#regarea .alert").html("用户名长度必须大于4位");
            return;
        }
        if (dataCarrier.userName.length < 2) {
            $("#regarea .alert").fadeIn();
            $("#regarea .alert").html("姓名长度必须大于1位");
            return;
        }
        if (dataCarrier.userPwd.length < 6) {
            $("#regarea .alert").fadeIn();
            $("#regarea .alert").html("密码长度必须大于或等于6位");
            return;
        }
        if (dataCarrier.userPwd != $("#regarea input[name='RepeatPwd']").val()) {
            $("#regarea .alert").fadeIn();
            $("#regarea .alert").html("两次输入的密码必须相同");
            return;
        }
        siteUtils.prepareSave($("#regarea button[data-act=reg]"));
        $.ajax({
            type: "POST",
            url: '/User/DoRegister',
            data: JSON.stringify(dataCarrier),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function () {
                window.location = "/Teaching/Navigator/Select";               
            },
            error: function (e) {
                $("#regarea .alert").fadeIn();
                $("#regarea .alert").html(e.responseText);
                siteUtils.showSaveEnd($("#regarea button[data-act=reg]"));
            }
        });
    })
})