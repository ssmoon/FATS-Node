$(document).ready(function () {
    $("#loginarea button[data-act='goreg']").on("click", function () {
        window.location = "/User/Register";
    })
    $("#loginarea button[data-act='login']").on("click", function () {
        $("#loginarea .alert").hide();
        var dataCarrier = {};       
        dataCarrier.userCode = $("#loginarea input[name='UserCode']").val();
        dataCarrier.userPwd = $("#loginarea input[name='Password']").val();
        
        if (dataCarrier.userCode.length < 4) {
            $("#loginarea .alert").fadeIn();
            $("#loginarea .alert").html("用户名必须大于4位");
            return;
        }       
        if (dataCarrier.userPwd.length < 6) {
            $("#loginarea .alert").fadeIn();
            $("#loginarea .alert").html("密码长度必须大于或等于6位");
            return;
        }
       
        siteUtils.prepareSave($("#loginarea button[data-act=login]"));
        $.ajax({
            type: "POST",
            url: '/User/DoLogin',
            data: JSON.stringify(dataCarrier),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result == "") {
                    window.location = "/Teachings/TeachingInit/T1Init";
                }
                else 
                {
                    siteUtils.showSaveEnd($("#loginarea button[data-act=login]"));
                    $("#loginarea .alert").fadeIn();
                    $("#loginarea .alert").html(result);
                }
            },
            error: function (e) {
               
            }
        });
    })
})