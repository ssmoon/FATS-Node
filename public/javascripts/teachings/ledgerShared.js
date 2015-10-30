$(document).ready(function () {    
    ledgerMng.initEvents();
    ledgerMng.initCtrls();
});


var ledgerMng = {
    initCtrls: function () {
        $("#fillerstepper a:first").click();
    },

    initEvents: function () {
        $("#fillerstepper a").bind("click", function () {
            $("#fillerstepper a").removeClass("active");
            $(this).addClass("active");
            $("#subjectcontainer div[data-subject]").hide();
            $("#subjectcontainer div[data-subject='" + $(this).attr("data-subject") + "']").show();
          
        });

    }
}