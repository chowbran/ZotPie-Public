var ZotPieCustomFields = new function () {
    var tab, tabpanels;

    var ps = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                              .getService(Components.interfaces.nsIPromptService);

    var ZoteroPane = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator)
    .getMostRecentWindow("navigator:browser").ZoteroPane;

    this.onLoad = function () {

        tab = document.getElementById("zotero-view-tabbox");

        if (tab) {
            console.log(tab.getAttribute("id"));

            var cdTab = document.createElement("tab");
            cdTab.setAttribute("id", "zotpie-customdatatab");
            cdTab.setAttribute("label", "Custom Data");
            cdTab.setAttribute("value", "customdata");
            tab.firstChild.appendChild(cdTab);
            //console.log(zoteroTab.firstChild.);
            //zoteroTab.firstChild.setAttribute("id", "zotpie-tabs");
        }

        tabpanels = document.getElementById("zotero-view-item");

        if (tabpanels) {
            var cdTabPanel = document.createElement("tabpanel");
            cdTabPanel.setAttribute("id", "zotpie-customdatapanel");
            //var zoterobox = document.createElement("zoteroitembox");
            //cdTabPanel.appendChild(zoterobox);

            tabpanels.appendChild(cdTabPanel);
        }
      
    },

    addToBatchEditQueue = function () {
        var selectedItems = ZoteroPane.getSelectedItems();
        var item = selectedItems[0];
        var counter = 0;

        for (i = 0; i < selectedItems.length; i++) {
            if (batchedItems.indexOf(selectedItems[i].id) == -1) {
                batchedItems.push(selectedItems[i].id);
                counter++;
            }
        }

        var flags = ps.BUTTON_POS_0 * ps.BUTTON_TITLE_IS_STRING +
            ps.BUTTON_POS_1 * ps.BUTTON_TITLE_IS_STRING +
            ps.BUTTON_POS_2 * ps.BUTTON_TITLE_IS_STRING;

        var button;

        if (counter == 0) {
            button = ps.confirmEx(null, "Warning", "Items are already in the batch edit queue.",
                   flags, "Open Batch Editor", "Continue Adding", null, null, {});
        } else {
            button = ps.confirmEx(null, "Success!", "Added " + counter + " items to the tag batch edit queue.\nThere are currently "
                                + batchedItems.length.toString() + " items in the queue.",
                               flags, "Open Batch Editor", "Continue Adding", null, null, {});
        }

        if (button == 0) {
            Zotero.ZotPie.startBatchEditor();
        }

        //toastr.success("test");

    },

    this.onUnload = function () {

    }

    this.onBeforeUnload = function () {

    }
}

window.addEventListener("load", function (e) { ZotPieCustomFields.onLoad(e); }, false);
window.addEventListener("unload", function (e) { ZotPieCustomFields.onUnload(e); }, false);
window.addEventListener("beforeunload", function (e) { ZotPieCustomFields.onBeforeUnload(e); }, false);
