var ZotPieCustomFields = new function () {
    var tab, tabpanels;

    var ps = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                              .getService(Components.interfaces.nsIPromptService);

    var ZoteroPane = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator)
    .getMostRecentWindow("navigator:browser").ZoteroPane;

    this.onLoad = function () {

        // Get tab element so that we can add our own tab
        tab = document.getElementById("zotero-view-tabbox");

        if (tab) {
            // Add custom field tab
            var cdTab = document.createElement("tab");
            cdTab.setAttribute("id", "zotpie-customdatatab");
            cdTab.setAttribute("label", "Custom Fields");
            cdTab.setAttribute("value", "customdata");
            tab.firstChild.appendChild(cdTab);
        }

        // Create tab panel element so that we can add
        // elements to it
        tabpanels = document.getElementById("zotero-view-item");

        if (tabpanels) {
            var cdTabPanel = document.createElement("tabpanel");
            cdTabPanel.setAttribute("id", "zotpie-customdatapanel");

            tabpanels.appendChild(cdTabPanel);
        }

        // Subscribe function to event when item in tree is clicked
        // This will update the custom data depending on the item clicked
        var itemsTree = document.getElementById('zotero-items-tree');
        itemsTree.addEventListener("click", updateCustomData, true);
    },

    updateCustomData = function (event) {
        // Get the current selected items
        //var items = ZoteroPane.getSelectedItems();
        var items = Zotero.getActiveZoteroPane().getSelectedItems();
        // Only show info if a single element is selected
        if (items.length < 2) {
            var cdTabPanel = document.getElementById("zotpie-customdatapanel");

            // Remove old data
            while (cdTabPanel.firstChild) {
                cdTabPanel.removeChild(cdTabPanel.firstChild);
            }

            // Get selected item
            var item = items[0];
        
            // Get the item field names and data
            var fields = Zotero.ZotPie.DBHelper.getFieldName(Zotero.ItemTypes.getName(item.itemTypeID));
            var data = Zotero.ZotPie.DBHelper.getFieldData(item.id);

            // Populate tab with field data
            var vbox = document.createElement("vbox");
            vbox.setAttribute("flex", "1");
            vbox.setAttribute("style", "overflow:auto");
            cdTabPanel.appendChild(vbox);

            var hbox = document.createElement("hbox");
            hbox.setAttribute("align", "center");
            hbox.setAttribute("style", "margin-left:5px");
            var fieldCount = document.createElement("label");

            var count;
            var countText = "custom fields:";

            if (fields === false || fields[0] === "") {
                count = 0;
            } else {
                count = fields.length;

                if (fields.length === 1) {
                    countText = "custom field:"
                }
            }

            // Create count label and add button
            fieldCount.setAttribute("value", count + " " + countText);
            fieldCount.setAttribute("pack", "center");
            fieldCount.setAttribute("align", "center")
            var addButton = document.createElement("button");
            addButton.setAttribute("label", "Add");
            //addButton.setAttribute("oncommand", "Zotero.ZotPie.startCustomFieldsEditor(tt)");
            addButton.addEventListener("click", function () { Zotero.ZotPie.startCustomFieldsEditor(item.itemTypeID) });
            hbox.appendChild(fieldCount);
            hbox.appendChild(addButton);
            hbox.appendChild(document.createElement("spacer"));
            vbox.appendChild(hbox);

            // Use a grid to align elements
            var grid = document.createElement("grid");
            grid.setAttribute("style", "margin-left:5px;margin-right:5px");
            var cols = document.createElement("columns");
            var col1 = document.createElement("column");
            col1.setAttribute("flex", "1");
            var col2 = document.createElement("column");
            col2.setAttribute("flex", "1");
            col2.setAttribute("width", "100");

            cols.appendChild(col1);
            cols.appendChild(col2);

            var rows = document.createElement("rows");
            vbox.appendChild(grid);
            grid.appendChild(rows);

            // Quit early if there is no data to display
            if (fields === false || fields[0] === "") {
                return;
            }

            // Display the field names and data
            for (i = 0; i < fields.length; i++) {
                var row = document.createElement("row");

                var t = document.createElement("label");
                t.setAttribute("style", "font-weight:bold;text-align:right");
                t.setAttribute("value", fields[i] + ":");

                var t2 = document.createElement("label");
                t2.setAttribute("flex", "1");
                t2.setAttribute("width", "100");
                t2.setAttribute("data-fieldindex", i);
                t2.setAttribute("data-itemid", item.id);
                // Add event click handler so that we can change the
                // element to a textbox when the user clicks on it
                t2.addEventListener("click", function (event) {
                    if (event.button) {
                        return;
                    }
                    showTextbox(this);
                }, false);

                t2.className = "zotero-clicky";

                if (data[i] != undefined) {
                    t2.setAttribute("value", data[i]);
                } else {
                    t2.setAttribute("value", "");
                }

                row.appendChild(t);
                row.appendChild(t2);

                rows.appendChild(row);
            }
        }
    },

    showTextbox = function (elem) {
        // User clicked on the label, show a textbox to accept user input
        var t = document.createElement("textbox");
        t.setAttribute("data-fieldindex", elem.getAttribute("data-fieldindex"));
        t.setAttribute("data-itemid", elem.getAttribute("data-itemid"));
        t.setAttribute('value', elem.getAttribute("value"));
        t.setAttribute('flex', '1');
        t.setAttribute('onblur', 'hideTextbox(this, this.value)');
        t.setAttribute('onkeypress', 'keyPress(this, event, this.value)');

        // Replace label with textbox
        var box = elem.parentNode;
        box.replaceChild(t, elem);

        t.focus();

        // A hacky way to change the cursor selection position
        // to the end of the textbox
        var val = t.value;
        t.value = '';
        t.value = val;
    },

    keyPress = function (elem, event) {
        var target = event.target;
        var focused = document.commandDispatcher.focusedElement;
	    
        // If the user presses the return key, save the value
        // If the user presses the escape key, revert to old value
        switch (event.keyCode) {
            case event.DOM_VK_RETURN:
                focused.blur();
                break;
            case event.DOM_VK_ESCAPE:
                // Reset field to original value
                target.value = target.getAttribute('value');
                focused.blur();
                break;
        }
    },

    hideTextbox = function (elem, value) {
        // Change textbox back into label and save the data value
        var t = document.createElement("label");
        t.setAttribute("flex", "1");
        t.setAttribute("width", "100");
        t.setAttribute("data-fieldindex", elem.getAttribute("data-fieldindex"));
        t.setAttribute("data-itemid", elem.getAttribute("data-itemid"));
        t.addEventListener("click", function (event) {
            if (event.button) {
                return;
            }
            showTextbox(this);
        }, false);

        t.className = "zotero-clicky";
        t.setAttribute("value", value);

        var id = elem.getAttribute("data-itemid");
        var index = elem.getAttribute("data-fieldindex");
        var fieldData = Zotero.ZotPie.DBHelper.getFieldData(id);

        if (fieldData === false) {
            fieldData = [];
        }

        while (index > fieldData.length) {
            fieldData.push("");
        }

        fieldData[index] = value;

        // Save value
        Zotero.ZotPie.DBHelper.setFieldData(id, fieldData);

        // Change label back to textbox
        var topBox = elem.parentNode;
        topBox.replaceChild(t, elem);
    },

    this.onUnload = function () {

    }

    this.onBeforeUnload = function () {

    }
}

window.addEventListener("load", function (e) { ZotPieCustomFields.onLoad(e); }, false);
window.addEventListener("unload", function (e) { ZotPieCustomFields.onUnload(e); }, false);
window.addEventListener("beforeunload", function (e) { ZotPieCustomFields.onBeforeUnload(e); }, false);
