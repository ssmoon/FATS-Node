var siteUtils = {
    prepareSave: function (targetButton) {
        targetButton.attr("data-loading-text", "保存中..");
        targetButton.button('loading');
    },
    showSaveSuccess: function (targetButton) {
        targetButton.button('reset');
        targetButton.popover({ content: "成功" });
        targetButton.popover('show');
        setTimeout(function () {
            targetButton.popover('destroy');
        }, 1500);
    },
    showSaveEnd: function (targetButton) {
        targetButton.button('reset');        
    },

    SerializeFormObjs: function (fields) {
        var resultJSON = {};
        for (var i = 0; i <= fields.length - 1; i++) {
            var item = fields[i];
            if (item.name == undefined)
                continue;
            resultJSON[item.name] = jQuery.trim(item.value);
        }
        return resultJSON;
    },

    SerializeFormObjsFrom: function (fields, fromObj) {
        var toObj = fromObj;
        for (var i = 0; i <= fields.length - 1; i++) {
            var item = fields[i];
            if (item.name == undefined)
                continue;
            toObj[item.name] = jQuery.trim(item.value);
        }
        return toObj;
    },

    FormatJSONDateToCompact: function (value) {
        if (value.indexOf("-") >= 0) return value;
        var dt = eval("new " + value.substr(1, value.length - 2));
        var month = dt.getMonth() + 1;
        if (month <= 9)
            month = "0" + month;
        var day = dt.getDate();
        if (day <= 0)
            day = "0" + day;
        return dt.getFullYear() + "-" + month + "-" + day;
    },

    TryAutoFillControl: function (info, ctrlID) {
        $.each(info, function (key, value) {
            var objList = $("#" + ctrlID + " *[name=" + key + "]");
            if (objList.length == 0)
                objList = $("*[alias=" + key + "]");
            if (objList.length == 0)
                return;
            if (objList.attr("data-valuetype") == "date") {
                if (objList.attr("data-static") == "1")
                    objList.html(siteUtils.FormatJSONDateToCompact(value));
                else {
                    objList.val(siteUtils.FormatJSONDateToCompact(value));

                }

            }
            else if (objList.attr("data-valuetype") == "money") {
                if (objList.attr("value") == undefined) {
                    value = Math.round(parseFloat(value) * 100) / 100;
                    objList.html(value.toFixed(2));
                }
                else {
                    value = Math.round(parseFloat(value) * 100) / 100;
                    objList.val(value.toFixed(2));
                }
            }
            else {
                if (objList.attr("data-static") == "1")
                    objList.html(value);
                else {
                    if (objList.attr("id") != objList.attr("name")) {
                        objList.val(value);
                        $("input[name=" + key + "]").val(value);
                    }
                    else objList.val(value);
                }
            }
        });
    }
}