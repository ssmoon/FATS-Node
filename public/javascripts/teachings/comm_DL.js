$(document).ready(function () {
    detailedLedgerMng.initCtrls();
    
});

var detailedLedgerMng = {
    initCtrls: function () {       
        $("#fillerstepper a:first").addClass("active");
        $("#fillerstepper a:first").click();
    },

    initEvents: function () {
        $("#tabcontainer li").bind("click", function () {
            $("#tabcontainer li").removeClass("seltab");
            $("#tabcontainer li").addClass("unseltab");
            $(this).addClass("seltab");
            $("#subjectcontainer div[data-subject]").hide();
            $("#subjectcontainer div[data-subject='" + $(this).attr("data-subject") + "']").show();
        });

    }
}
