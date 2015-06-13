/*
 * Messagebox popups.
 * The popups are non blocking but are based on the promises implemented by the jquery deferred feature.
 * Yes,Ok buttons all treated as a resolved promise and no is a rejected promise
 */
(function () {
    var msgbox = function () {
        //Templates for various message boxes
        var InfoTemplate = kendo.template("<div class='CBkmsgbox'><p>#= msg #</p><button id='kmsgok' class='k-button CBkmsgbutarea'>OK</button><p style='clear: both'></p></div>");
        var WarningTemplate = kendo.template("<div class='CBkmsgbox'><p class='CBkmsgboxtitle'>Warning</p><p>#= msg #</p><button id='kmsgok' class='k-button CBkmsgbutarea'>OK</button><p style='clear: both'></p></div>");
        var YesNoTemplate = kendo.template("<div class='CBkmsgbox'><p>#= msg #</p><button id='kmsgcancel' class='k-button CBkmsgbutarea'>NO</button><button id='kmsgok' class='k-button CBkmsgbutarea'>YES</button><p style='clear: both'></p></div>");

        var defer;
        var win;

        //create the window reasy for use
        function init() {
            win = $("<div>").kendoWindow({
                modal: true,
                title: false,
                resizable: false,
                maxWidth: 500
            }).data("kendoWindow");
        }

        function popup(mode, msg) {
            defer = $.Deferred();

            var data = { msg: msg };
            var result;
            if (mode === "info") {
                result = InfoTemplate(data);
            } else if (mode === "warning") {
                result = WarningTemplate(data);
            } else {
                result = YesNoTemplate(data);
            }

            win.content(result);
            win.center().open();

            if (mode === "yesno") {
                $("#kmsgcancel").on("click", function () {
                    defer.reject();
                    win.close();
                });
            }
            $("#kmsgok").on("click", function () {
                defer.resolve();
                win.close();
            });

            $(".k-window-content").addClass("CBkmsgbg");

            return defer;
        }

        return {
            Initialise: function(){
                init();
            },
            Info: function (msg) {
                return popup("info", msg);
            },

            Warning: function (msg) {
                return popup("warning", msg);
            },

            YesNo: function (msg) {
                return popup("yesno", msg);
            },

            //Question only presented to the user if the condition is true otherwise reutrns success immediantly
            YesNoOnCondition: function (msg, condition) {
                if (condition) {
                    return popup("yesno", msg);
                } else {
                    defer = $.Deferred();
                    defer.resolve();
                    return defer;
                }
            }


        };
    };
    window.CBmessagebox = msgbox();
})();