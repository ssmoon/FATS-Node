var navigationT1Mng = require('./teaching1Comm');

var subjectFillerMng = {
    initCtrls: function() {
        $("#navbar").hide();
        $("#subjectfiller .panel[data-idx=1]").show();
        $("#subjectfiller :input[data-correct]").bind("focus", function () {
            $(this).removeClass("incorrect");
            $("#subjectfiller .errorarea").hide();
        });
    },

    initEvent: function() {
        $("#subjectnav").on("click", "button[data-step=help]", function() {
            $("#subjectfiller .helparea div").hide();
            $("#subjectfiller .helparea").show();
            $("#subjectfiller .helparea div[data-idx=" + $("#subjectfiller").attr("data-curr") + "]").slideDown();
        })
        $("#subjectnav").on("click", "button[data-step=auto]", function () {
            $("#subjectfiller .panel[data-idx] :input[data-correct]").each(function () {
                $(this).val($(this).attr("data-correct"));
            });
            $("#subjectfiller .errorarea").hide();
            $("#subjectfiller .helparea").hide();
            $("#subjectnav").hide();

            $("#subjectfiller .panel[data-idx]").show();
                $("#navbar button[data-step=check]").hide();
                $("#navbar button[data-step=auto]").hide();
                $("#navbar").show();
                navigationT1Mng.checkStatus = 1;

        })
        $("#subjectnav").on("click", "button[data-step=all]", function () {
            $("#subjectfiller .panel").show();
            $("#subjectfiller :input[data-correct]").each(function () {
                $(this).val($(this).attr("data-correct"));
            });
            $("#subjectfiller .errorarea").hide();
            $("#subjectfiller .helparea").hide();
            $("#subjectnav").hide();
            
            $("#navbar button[data-step=check]").hide();
            $("#navbar button[data-step=auto]").hide();
            $("#navbar").show();
            navigationT1Mng.checkStatus = 1;

        })
        $("#subjectnav").on("click", "button[data-step=next]", function () {
            if ($("#subjectfiller").attr("data-curr") == "1") {
                var correctArr = new Array();
                var answerArr = new Array();
                $("#subjectfiller div[data-idx=1] input[data-correct]").each(function () {
                    correctArr.push($(this).attr("data-correct"));
                    answerArr.push(jQuery.trim($(this).val()));
                });
                if (correctArr.sort().join() != answerArr.sort().join()) {
                    $("#subjectfiller .errorarea").slideDown();
                    return;
                }
            }
            else {
                var allCorrect = true;
                $("#subjectfiller div[data-idx=" + $("#subjectfiller").attr("data-curr") + "] :input[data-correct]").each(function () {
                    $(this).removeClass("incorrect");
                    $(this).removeClass("correct");
                    if ($(this).attr("data-correct") != $(this).val()) {
                        allCorrect = false;
                        $(this).addClass("incorrect");
                    }
                    else $(this).addClass("correct");
                });
                if (!allCorrect) {
                    $("#subjectfiller .errorarea").slideDown();
                    return;
                }
            }
            var newSectionIdx = Number($("#subjectfiller").attr("data-curr")) + 1;
            $("#subjectfiller").attr("data-curr", newSectionIdx);
            $("#subjectfiller .errorarea").hide();
            $("#subjectfiller .helparea").hide();
            if (newSectionIdx == 7) {
                $("#subjectfiller .finalanswer").show();
            }
            if (newSectionIdx == 8) {
                $("#subjectnav").hide();
                $("#navbar button[data-step=check]").hide();
                $("#navbar button[data-step=auto]").hide();
                $("#navbar").show();
                navigationT1Mng.checkStatus = 1;
            }
            $("#subjectfiller .panel[data-idx=" + newSectionIdx + "]").show();
            $("#subjectfiller .panel[data-idx=" + newSectionIdx + "] a").click();
        })
    }
}

module.exports = subjectFillerMng;
