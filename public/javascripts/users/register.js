$(document).ready(function () {
    $("#regarea button[data-act='gologin']").on("click", function () {
        window.location = "/User/Login";
    })
    $("#regarea button[data-act='reg']").on("click", function () {
        $("#regarea .alert").hide();
        var dataCarrier = {};
        dataCarrier.user = {};
        dataCarrier.valCode = $("#regarea input[name='ActivationCode']").val();
        dataCarrier.user.UserCode = $("#regarea input[name='UserCode']").val();
        dataCarrier.user.UserName = $("#regarea input[name='UserName']").val();
        dataCarrier.user.School = $("#regarea input[name='School']").val();
        dataCarrier.user.Password = $("#regarea input[name='Password']").val();
        
        if (dataCarrier.user.UserCode.length < 4) {
            $("#regarea .alert").fadeIn();
            $("#regarea .alert").html("用户名必须大于4位");
            return;
        }
        if (dataCarrier.user.UserName.length < 2) {
            $("#regarea .alert").fadeIn();
            $("#regarea .alert").html("用户名必须大于或者等于2位");
            return;
        }
        if (dataCarrier.user.Password.length < 6) {
            $("#regarea .alert").fadeIn();
            $("#regarea .alert").html("密码长度必须大于或等于6位");
            return;
        }
        if (dataCarrier.user.Password != $("#regarea input[name='RepeatPwd']").val()) {
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
            success: function (result) {
                if (result == "") {
                    window.location = "/Teachings/TeachingInit/T1Init";
                }
                else 
                {
                    siteUtils.showSaveEnd($("#regarea button[data-act=reg]"));
                    $("#regarea .alert").fadeIn();
                    $("#regarea .alert").html(result);
                }
            },
            error: function (e) {
               
            }
        });
    })
})