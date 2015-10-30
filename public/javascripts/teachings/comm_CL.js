$(document).ready(function () {
    InitTabs();
    $("#tabcontainer li:first").click();
});

function InitTabs() {
    
    $("#tabcontainer li").bind("click", function () {
        $("#tabcontainer li").removeClass("seltab");
        $("#tabcontainer li").addClass("unseltab");
        $(this).addClass("seltab");
        $("#subjectcontainer div[data_subject]").hide();
        $("#subjectcontainer div[data_subject='" + $(this).attr("data_subject") + "']").show();
    });
    $("#tabcontainer li").addClass("undo");
}