var ZotPieOverlay = new function ()
{
    var cslEditor, win, fields, insert, insertAfter, remove;

    this.isTab = false;

	this.onLoad = function() {

	    cslEditor = document.getElementById("zotero-csl-editor");
	    win = document.getElementById("csl-edit");
			
	    if (win) {
            // Create groupbox to hold controls
	        var grp = document.createElement("groupbox");
	        grp.setAttribute("id", "zotpie-groupbox");
            
            // Create caption label for groupbox
	        var caption = document.createElement("caption");
	        caption.setAttribute("label", "Controls");

	        grp.appendChild(caption);
	        win.appendChild(grp);

            // Fill the groupbox
	        var hbox = document.createElement("hbox");
	        grp.appendChild(hbox);
	        fields = document.createElement("menulist");
	        fields.setAttribute("id", "zotpie-fields");

	        //var menupopup = document.createElement("menupopup");
	        //menupopup.setAttribute("id", "zotpie-fieldpu");
	        hbox.appendChild(fields);

	        insert = document.createElement("button");
	        insert.setAttribute("id", "zotpie-insert");
	        insert.setAttribute("label", "Insert");
	        insert.setAttribute("oncommand", "insertField();");
	        hbox.appendChild(insert);

	        insertAfter = document.createElement("button");
	        insertAfter.setAttribute("id", "zotpie-insertafter");
	        insertAfter.setAttribute("label", "Insert After");
	        insertAfter.setAttribute("oncommand", "insertFieldAfter();");
	        hbox.appendChild(insertAfter);

	        remove = document.createElement("button");
	        remove.setAttribute("id", "zotpie-remove");
	        remove.setAttribute("label", "Remove");
	        remove.setAttribute("oncommand", "insertAtPoint(\"testwackamoleeee\");");
	        hbox.appendChild(remove);

            // Set default value of fields
	        fields.appendItem("--Select Field--", "selectfield");
	        fields.selectedIndex = 0;
		}
	}
	
	insertAtPoint = function (text) {
	    var pos = cslEditor.selectionStart;
	    cslEditor.value = cslEditor.value.substr(0, pos) + '\n'
                            + text + cslEditor.value.substr(cslEditor.selectionEnd, cslEditor.textLength);

	    cslEditor.selectionStart = pos + text.length + 1;
	    cslEditor.selectionEnd = pos + text.length + 1;
	    cslEditor.focus();
	}

	addItem = function (fieldName) {
        // Add field to the combobox
	    fields.appendItem(fieldName);
	}

	clearFields = function () {
	    fields.RemoveAllItems();
	    fields.appendItem("--Select Field--", "selectfield");
	    fields.selectedIndex = 0;
	}

	insertField = function () {
        // Get selected field name
	    var field = fields.selectedItem.label;

        // Do something depending on field
	}

	insertFieldAfter = function () {
	    // Get selected field name
	    var field = fields.selectedItem.label;

	    // Do something depending on field
	}
       
	removeField = function () {

	}

	this.onUnload = function() {

	}
	
	this.onBeforeUnload = function() {

	}
}

window.addEventListener("load", function(e) { ZotPieOverlay.onLoad(e); }, false);
window.addEventListener("unload", function(e) { ZotPieOverlay.onUnload(e); }, false);
window.addEventListener("beforeunload", function(e) { ZotPieOverlay.onBeforeUnload(e); }, false);
