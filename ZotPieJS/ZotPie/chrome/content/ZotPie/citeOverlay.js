var CiteOverlay = new function ()
{
    var cslEditor, win, fields, insert, insertAfter, remove, types;

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
	        newcite = document.createElement("button");
	        newcite.setAttribute("id", "zotpie-new");
	        newcite.setAttribute("label", "Create New");
	        newcite.setAttribute("oncommand", "createNew();");
	        fields = document.createElement("menulist");
	        fields.setAttribute("id", "zotpie-fields");
 		    types = document.createElement("menulist");
	        types.setAttribute("id", "zotpie-types");
	        types.setAttribute("oncommand", "addItem();");
	        layouts = document.createElement("menulist");
	        layouts.setAttribute("id", "zotpie-layout");

	        format = document.createElement("menulist");
	        format.setAttribute("id", "zotpie-format")
	        format.setAttribute("oncommand", "changeFormat();");

	
	        //var menupopup = document.createElement("menupopup");
	        //menupopup.setAttribute("id", "zotpie-fieldpu");
	        hbox.appendChild(newcite);
	        hbox.appendChild(format);
		    hbox.appendChild(types);
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
	        remove.setAttribute("oncommand", "removeField();");
	        hbox.appendChild(layouts);
	        hbox.appendChild(remove);

	        // Set default value of fields
	        layouts.appendItem("--Select Layouts--", "selectlayout");
	        layouts.selectedIndex = 0;
	        format.appendItem("--Select Format--", "selectformat");
	        format.appendItem("Citation", "citation");
	        format.appendItem("Bibliography", "bibliography");
	        format.selectedIndex = 0;
	        fields.appendItem("--Select Field--", "selectfield");
	        fields.selectedIndex = 0;
	        types.appendItem("--Select Type--", "selecttype");
	        types.selectedIndex = 0;
		    var itemTypes = Zotero.ItemTypes.getTypes();
		for(var i = 0; i < itemTypes.length; i++){
		    types.appendItem(Zotero.ItemTypes.getLocalizedString(itemTypes[i]['name']), itemTypes[i]['id']);
			}
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

	addItem = function () {
	    fields.removeAllItems();
	    fields.appendItem("--Select Field--", "selectfield");
	    fields.selectedIndex = 0;
	    var typename = (types.selectedItem).getAttribute("value");
	    var field = Zotero.ItemFields.getItemTypeFields(typename);
        fields.appendItem("Author","author")
	    for (var i = 0; i < field.length; i++) {
	        fields.appendItem(Zotero.ItemFields.getLocalizedString(typename, Zotero.ItemFields.getName(field[i])), Zotero.ItemFields.getName(field[i]));
	    }
	    

	}

	createNew = function () {
	    var res = confirm("Pressing ok will remove current style");
	    if (res) {
	        var title = prompt('Please enter the title of your style', 'title');
	        var userid = prompt('Please enter the id of your style', 'http://www.zotero.org/styles/');
	        var now = new Date();
	        var utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
	        cslEditor.value = '<?xml version="1.0" encoding="utf-8"?>\n';
	        cslEditor.value = cslEditor.value + '<style xmlns="http://purl.org/net/xbiblio/csl" class="in-text" version="1.0" >\n';
	        cslEditor.value = cslEditor.value + '\t<info>\n';
	        cslEditor.value = cslEditor.value + '\t\t<title>' + title + '</title>\n';
	        cslEditor.value = cslEditor.value + '\t\t<id>' + userid + '</id>\n';
	        cslEditor.value = cslEditor.value + '\t\t<updated>' + utc + '</updated>\n';
	        cslEditor.value = cslEditor.value + '\t</info>\n';
	        cslEditor.value = cslEditor.value + '\t<citation>\n';
	        cslEditor.value = cslEditor.value + '\t\t<layout>\n';
	        cslEditor.value = cslEditor.value + '\t\t</layout>\n';
	        cslEditor.value = cslEditor.value + '\t</citation>\n';
	        cslEditor.value = cslEditor.value + '\t<bibliography>\n';
	        cslEditor.value = cslEditor.value + '\t\t<layout>\n';
	        cslEditor.value = cslEditor.value + '\t\t</layout>\n';
	        cslEditor.value = cslEditor.value + '\t</bibliography>\n';
	        cslEditor.value = cslEditor.value + '</style>\n';
	        Zotero_CSL_Editor.onStyleModified();

	    }
	    else {
	        return;
	    }

	}

	changeFormat = function () {
	    layouts.removeAllItems();
	    layouts.appendItem("--Select Layouts--", "selectlayout");
	    layouts.selectedIndex = 0;
	    var formatname = (format.selectedItem).getAttribute("value");
	    if (formatname == "citation") {
	        var start = cslEditor.value.indexOf("<citation");
	        var end = cslEditor.value.indexOf("</citation");
	        var res = (cslEditor.value.substring(start, end));
	        res = res.split("\n");
	        for (var i = 0; i < res.length; i++) {
	            if (res[i].indexOf("<text") > -1) {
	                start = res[i].indexOf('="') + 2;
	                end = (res[i].substring(start, res[i].length)).indexOf('"') + start;
	                layouts.appendItem(res[i].substring(start, end), res[i]);
	            }
	        }
	        return;
	    }
	    else if (formatname == "bibliography") {
	        var start = cslEditor.value.indexOf("<bibliography");
	        var end = cslEditor.value.indexOf("</bibliography");
	        var res = (cslEditor.value.substring(start, end));
	        res = res.split("\n");
	        for (var i = 0; i < res.length; i++) {
	            if (res[i].indexOf("<text") > -1) {
	                start = res[i].indexOf('="') + 2;
	                end = (res[i].substring(start, res[i].length)).indexOf('"') + start;
	                layouts.appendItem(res[i].substring(start,end), res[i]);
	            }
	        }
	    }
	    else {
	        return;
	    }
	}



	insertField = function () {

	    var fieldname = (fields.selectedItem).getAttribute("value");
	    if (fieldname != "selectfield") {
            
	    	var input = '<text variable="' + fieldname;
	    	input = input + '"/>';
	    	insertAtPoint(input);
	    	Zotero_CSL_Editor.onStyleModified();
	    }
	    else {
	        Zotero_CSL_Editor.onStyleModified();
		    return;
	    }
	    
	    
        // Do something depending on field
	}

	insertFieldAfter = function () {
	    // Get selected field name

	    // Do something depending on field
	}
       
	removeField = function () {
	    if (layouts.itemCount == 1){
	        return;    
	    }
	    var layoutname = (layouts.selectedItem).getAttribute("value");
	    if (layoutname == "selectlayout") {
	        return;
	    }
	    cslEditor.value = (cslEditor.value).replace(layoutname, "");
	    layouts.selectedIndex = layouts.selectedIndex - 1;
	    layouts.removeItemAt(layouts.selectedIndex + 1);
	    Zotero_CSL_Editor.onStyleModified();
	}

	this.onUnload = function() {

	}
	
	this.onBeforeUnload = function() {

	}
}

window.addEventListener("load", function(e) { CiteOverlay.onLoad(e); }, false);
window.addEventListener("unload", function(e) { CiteOverlay.onUnload(e); }, false);
window.addEventListener("beforeunload", function(e) { CiteOverlay.onBeforeUnload(e); }, false);
