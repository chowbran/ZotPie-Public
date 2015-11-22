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
            cdTab.setAttribute("label", "Custom Fields");
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

            var item = items[0];
            console.log(item.id);

            var fields = Zotero.ZotPie.DBHelper.getFieldName(Zotero.ItemTypes.getName(item.itemTypeID));
            var data = Zotero.ZotPie.DBHelper.getFieldData(item.id);

            console.log(fields);
            var vbox = document.createElement("vbox");
            vbox.setAttribute("flex", "1");
            vbox.setAttribute("style", "overflow:auto");
            cdTabPanel.appendChild(vbox);

            var hbox = document.createElement("hbox");
            //hbox.setAttribute("pack", "center");
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

            fieldCount.setAttribute("value", count + " " + countText);
            fieldCount.setAttribute("pack", "center");
            fieldCount.setAttribute("align", "center")
            var addButton = document.createElement("button");
            addButton.setAttribute("label", "Add");
            addButton.setAttribute("oncommand", "Zotero.ZotPie.startCustomFieldsEditor()");
            hbox.appendChild(fieldCount);
            hbox.appendChild(addButton);
            hbox.appendChild(document.createElement("spacer"));
            vbox.appendChild(hbox);

            var grid = document.createElement("grid");
            grid.setAttribute("style", "margin-left:5px;margin-right:5px");
            var cols = document.createElement("columns");
            var col1 = document.createElement("column");
            col1.setAttribute("flex", "1");
            var col2 = document.createElement("column");
            col2.setAttribute("flex", "1");
            col2.setAttribute("width", "100");
            //var col3 = document.createElement("column");
            //col3.setAttribute("flex", "1");

            cols.appendChild(col1);
            cols.appendChild(col2);
            //cols.appendChild(col3);

            var rows = document.createElement("rows");
            //var row1 = document.createElement("row");

            //var fieldName = document.createElement("label");
            //fieldName.setAttribute("value", "Field Name");
            //fieldName.setAttribute("style", "font-weight:bold;margin-right:70px");
            //fieldName.setAttribute("flex", "1");
            //var fieldData = document.createElement("label");
            //fieldData.setAttribute("value", "Data");
            //fieldData.setAttribute("style", "font-weight:bold");
            //fieldData.setAttribute("flex", "1");

            //row1.appendChild(fieldName);
            //row1.appendChild(fieldData);
            //rows.appendChild(row1);

            vbox.appendChild(grid);
            grid.appendChild(rows);


            //var data = db.getData();
            //var data = [["Gregorian Date", "March 10 1994"], ["Medical Number", "1042"]];

            console.log(fields);

            if (fields === false || fields[0] === "") {
                return;
            }

            for (i = 0; i < fields.length; i++) {
                //var d = data[i];
                var row = document.createElement("row");

                var t = document.createElement("label");
                t.setAttribute("style", "font-weight:bold;text-align:right");
                t.setAttribute("value", fields[i] + ":");

                //var t = document.createElement("label");
                //t.setAttribute("flex", "1");
                ////t.setAttribute("width", "150");
                //t.addEventListener("click", function (event) {
                //    if (event.button) {
                //        return;
                //    }
                //    showTextbox(this);
                //}, false);

                //t.className = "zotero-clicky";
                //t.setAttribute("value", data[i][0]);

                var t2 = document.createElement("label");
                t2.setAttribute("flex", "1");
                t2.setAttribute("width", "100");
                t2.setAttribute("data-fieldindex", i);
                t2.setAttribute("data-itemid", item.id);
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

                //var removeButton = document.createElement('label');

                row.appendChild(t);
                row.appendChild(t2);
                //row.appendChild(removeButton);

                rows.appendChild(row);

                ////removeButton.setAttribute("flex", "1");
                //removeButton.setAttribute("value", "-");
                //removeButton.setAttribute("class", "zotero-clicky zotero-clicky-minus");
                //removeButton.setAttribute("onclick", "removeRow(this)");


            }
        }

        

    },

    addRow = function (elem) {

    },

    //removeRow = function (elem) {
    //    //rows.removeChild(row);

    //},

    showTextbox = function (elem) {
        console.log(elem.getAttribute("data-fieldindex"));
        console.log(elem.getAttribute("data-itemid"));
        var t = document.createElement("textbox");
        t.setAttribute("data-fieldindex", elem.getAttribute("data-fieldindex"));
        t.setAttribute("data-itemid", elem.getAttribute("data-itemid"));
        t.setAttribute('value', elem.getAttribute("value"));
        //t.setAttribute('fieldname', fieldName);
        //t.setAttribute('ztabindex', tabindex);
        t.setAttribute('flex', '1');
        //t.setAttribute("width", "120");
        t.setAttribute('onblur', 'hideTextbox(this, this.value)');
        t.setAttribute('onkeypress', 'keyPress(this, event, this.value)');

        var box = elem.parentNode;
        box.replaceChild(t, elem);

        t.focus();

        var val = t.value;
        t.value = '';
        t.value = val;
        //t.setAttribute('onkeypress', "return document.getBindingParent(this).handleKeyPress(event)");
        //t.setAttribute('onpaste', "return document.getBindingParent(this).handlePaste(event)");
    },

    keyPress = function (elem, event) {
        var target = event.target;
        var focused = document.commandDispatcher.focusedElement;
					
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
        var t = document.createElement("label");
        t.setAttribute("flex", "1");
        t.setAttribute("width", "100");
        t.setAttribute("data-fieldindex", elem.getAttribute("data-fieldindex"));
        t.setAttribute("data-itemid", elem.getAttribute("data-itemid"));
        //t.setAttribute("width", "150");
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

        console.log(fieldData);
        if (fieldData === false) {
            fieldData = [];
        }

        //console.log(fieldData);
        while (index > fieldData.length) {
            fieldData.push("");
        }

        fieldData[index] = value;

        Zotero.ZotPie.DBHelper.setFieldData(id, fieldData);

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
