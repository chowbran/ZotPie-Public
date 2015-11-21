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

        // Subscribe function to event when item in tree is clicked
        var itemsTree = document.getElementById('zotero-items-tree');
        itemsTree.addEventListener("click", updateCustomData, true);
      
    },

    updateCustomData = function (event) {
        var items = ZoteroPane.getSelectedItems();

        if (items.length < 2) {
            
            // Remove old child nodes
            var cdTabPanel = document.getElementById("zotpie-customdatapanel");

            while (cdTabPanel.firstChild) {
                cdTabPanel.removeChild(cdTabPanel.firstChild);
            }

            var vbox = document.createElement("vbox");
            vbox.setAttribute("flex", "1");
            vbox.setAttribute("style", "overflow:auto");
            cdTabPanel.appendChild(vbox);

            var addButton = document.createElement("button");
            addButton.setAttribute("label", "Add");
            addButton.setAttribute("oncommand", "addRow(this)");
            vbox.appendChild(addButton);

            var item = items[0];
            console.log(item.id);

            var grid = document.createElement("grid");
            grid.setAttribute("style", "margin:10px");
            var cols = document.createElement("columns");
            var col1 = document.createElement("column");
            col1.setAttribute("flex", "1");
            var col2 = document.createElement("column");
            col2.setAttribute("flex", "1");
            var col3 = document.createElement("column");
            col3.setAttribute("flex", "1");

            cols.appendChild(col1);
            cols.appendChild(col2);
            cols.appendChild(col3);

            var rows = document.createElement("rows");
            var row1 = document.createElement("row");

            var fieldName = document.createElement("label");
            fieldName.setAttribute("value", "Field Name");
            fieldName.setAttribute("style", "font-weight:bold;margin-right:100px");
            fieldName.setAttribute("flex", "1");
            var fieldData = document.createElement("label");
            fieldData.setAttribute("value", "Data");
            fieldData.setAttribute("style", "font-weight:bold");
            fieldData.setAttribute("flex", "1");

            row1.appendChild(fieldName);
            row1.appendChild(fieldData);
            rows.appendChild(row1);

            vbox.appendChild(grid);
            grid.appendChild(rows);


            //var data = db.getData();
            var data = [["cool", "aaazxczxlckzxclkzlca"], ["bees", "knees"]];
            for (i = 0; i < data.length; i++) {
                var d = data[i];
                var row = document.createElement("row");

                var t = document.createElement("label");
                t.setAttribute("flex", "1");
                //t.setAttribute("width", "150");
                t.addEventListener("click", function (event) {
                    if (event.button) {
                        return;
                    }
                    showTextbox(this);
                }, false);

                t.className = "zotero-clicky";
                t.setAttribute("value", data[i][0]);

                var t2 = document.createElement("label");
                t2.setAttribute("flex", "1");
                t2.addEventListener("click", function (event) {
                    if (event.button) {
                        return;
                    }
                    showTextbox(this);
                }, false);

                t2.className = "zotero-clicky";
                t2.setAttribute("value", data[i][1]);

                var removeButton = document.createElement('label');
                //removeButton.setAttribute("flex", "1");
                removeButton.setAttribute("value", "-");
                removeButton.setAttribute("class", "zotero-clicky zotero-clicky-minus");
                removeButton.setAttribute("onclick", "removeRow(this)");

                row.appendChild(t);
                row.appendChild(t2);
                row.appendChild(removeButton);

                rows.appendChild(row);
            }
        }

        

    },

    addRow = function (elem) {

    },

    removeRow = function (elem) {

    },

    showTextbox = function (elem) {
        var t = document.createElement("textbox");
        t.setAttribute('value', elem.getAttribute("value"));
        //t.setAttribute('fieldname', fieldName);
        //t.setAttribute('ztabindex', tabindex);
        t.setAttribute('flex', '1');
        //t.setAttribute("width", "120");
        t.setAttribute('onblur', 'hideTextbox(this, this.value)');

        var box = elem.parentNode;
        box.replaceChild(t, elem);

        t.focus();

        var val = t.value;
        t.value = '';
        t.value = val;
        //t.setAttribute('onkeypress', "return document.getBindingParent(this).handleKeyPress(event)");
        //t.setAttribute('onpaste', "return document.getBindingParent(this).handlePaste(event)");
    },

    hideTextbox = function (elem, value) {
        var t = document.createElement("label");
        t.setAttribute("flex", "1");
        //t.setAttribute("width", "150");
        t.addEventListener("click", function (event) {
            if (event.button) {
                return;
            }
            showTextbox(this);
        }, false);

        t.className = "zotero-clicky";
        t.setAttribute("value", value);

        var box = elem.parentNode;
        box.replaceChild(t, elem);
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
