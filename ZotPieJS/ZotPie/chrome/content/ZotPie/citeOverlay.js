var CiteOverlay = new function ()
{
    var cslEditor, win, fields, insert, insertAfter, remove, types, ClickableUI,layouts,selected,value;

	this.onLoad = function() {

	    cslEditor = document.getElementById("zotero-csl-editor");
	    cslEditor.style.display = 'none';
	    cslList = document.getElementById("zotero-csl-list");
	    cslList.setAttribute("oncommand", "refreshBox(event);");
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
	        var hbox = document.createElement("box");
	        ClickableUI = document.createElement("arrowscrollbox");
	        cslEditor.parentNode.insertBefore(ClickableUI, cslEditor);
	       // ClickableUI.setAttribute("align", "center");
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
	
	        
	        format = document.createElement("menulist");
	        format.setAttribute("id", "zotpie-format")
	        format.setAttribute("oncommand", "changeFormat();");

	        checkbox = document.createElement("checkbox");
	        checkbox.setAttribute("label", "Preview TextBox");
	        checkbox.setAttribute("checked", false);
	        checkbox.setAttribute("oncommand", "onToggle();");
	
	        //var menupopup = document.createElement("menupopup");
	        //menupopup.setAttribute("id", "zotpie-fieldpu");
           
	        hbox.appendChild(checkbox);
	        hbox.appendChild(newcite);
	        hbox.appendChild(format);
		    hbox.appendChild(types);
		    hbox.appendChild(fields);


	        insert = document.createElement("button");
	        insert.setAttribute("id", "zotpie-insert");
	        insert.setAttribute("label", "Insert");
	        insert.setAttribute("oncommand", "insertField();");
	        hbox.appendChild(insert);


	        remove = document.createElement("button");
	        remove.setAttribute("id", "zotpie-remove");
	        remove.setAttribute("label", "Remove");
	        remove.setAttribute("oncommand", "removeField();");
	        hbox.appendChild(remove);

	        // Set default value of fields
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
	
	insertAtPoint = function (text, pos) {
	    cslEditor.value = cslEditor.value.substr(0, pos) 
                            + text  + '\n' + cslEditor.value.substr(pos, cslEditor.textLength);
	    cslEditor.selectionStart = pos + text.length + 1;
	    cslEditor.selectionEnd = pos + text.length + 1;
	    cslEditor.focus();
	}
	refreshBox = function (value) {
	    Zotero_CSL_Editor.onStyleSelected(value.target.value);
	    fields.removeAllItems();
	    fields.appendItem("--Select Field--", "selectfield");
	    fields.selectedIndex = 0;
	    ClickableUI.innerHTML = "";
	    types.selectedIndex = 0;
	    format.selectedIndex = 0;
	    selected = undefined;

	}
	addItem = function () {
	    fields.removeAllItems();
	    fields.appendItem("--Select Field--", "selectfield");
	    fields.selectedIndex = 0;
	    var typename = (types.selectedItem).getAttribute("value");
	    fields.appendItem("Author", "author");
	    var field = Zotero.ItemFields.getItemTypeFields(typename);
	    for (var i = 0; i < field.length; i++) {
	        fields.appendItem(Zotero.ItemFields.getLocalizedString(typename, Zotero.ItemFields.getName(field[i])), Zotero.ItemFields.getName(field[i]));
	    }
	    

	}

	onToggle = function () {
	    if (cslEditor.style.display== 'none') {
	        cslEditor.style.display = 'inherit';
	        ClickableUI.style.display = 'none';

	    }
	    else {
	        cslEditor.style.display = 'none';
	        ClickableUI.style.display = 'inherit';
	    }
	}

	createNew = function () {
	    var res = confirm("Pressing ok will remove current style");
	    if (res) {
	        ClickableUI.innerHTML = "";
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
	    //layouts.removeAllItems();
	    var formatname = (format.selectedItem).getAttribute("value");
	    if (formatname == "citation") {
	        ClickableUI.innerHTML = "";
	        var start = cslEditor.value.indexOf("<citation");
	        var end = cslEditor.value.indexOf("</citation");
	        var res = (cslEditor.value.substring(start, end));
	        res = res.split("\n");
	        for (var i = 0; i < res.length; i++) {
	            if (res[i].indexOf("<text") > -1) {
	                start = res[i].indexOf('="') + 2;
	                end = (res[i].substring(start, res[i].length)).indexOf('"') + start;
	                var button = document.createElement("button");
	                button.setAttribute("id", res[i].trim());
	                button.setAttribute("label", res[i].substring(start, end));
	                button.setAttribute("oncommand", "selectField(event)");
	                ClickableUI.appendChild(button);

	            }
	        }
	        return;
	    }
	    else if (formatname == "bibliography") {
            ClickableUI.innerHTML = "";
	        var start = cslEditor.value.indexOf("<bibliography");
	        var end = cslEditor.value.indexOf("</bibliography");
	        var res = (cslEditor.value.substring(start, end));
	        res = res.split("\n");
	        for (var i = 0; i < res.length; i++) {
	            if (res[i].indexOf("<text") > -1) {
	                start = res[i].indexOf('="') + 2;
	                end = (res[i].substring(start, res[i].length)).indexOf('"') + start;
	                var button = document.createElement("button");
	                button.setAttribute("id", res[i].trim());
	                button.setAttribute("label", res[i].substring(start, end));
	                button.setAttribute("oncommand", "selectField(event)");
	                ClickableUI.appendChild(button);
	            }
	        }
	    }
	    else {
	        return;
	    }
	}

	selectField = function (value) {
	    selected = value.target.id;
	}

	insertField = function () {

	    var fieldname = (fields.selectedItem).getAttribute("value");
	    alert(fieldname);
	    switch (fieldname) {
	        case "websiteTitle":
	            fieldname = 'container-title';
	            break;
	        case "publicationTitle":
	            fieldname = 'container-title';
	            break;
	        case "url":
	            fieldname = 'URL';
	            break;
	        case 'place':
	            fieldname = 'publisher-place';
	            break;
	        case 'numPages':
	            fieldname = 'number-of-pages';
	            break;
	        case 'series':
	            fieldname = 'collection-title';
	            break;
	        case 'seriesNumber':
	            fieldname = 'collection-number';
	            break;
	        case 'university':
	            fieldname = 'publisher';
	            break;
	        case 'conferenceName':
	            fieldname = 'event';
	            break;
	        case 'numberOfVolumes':
	            fieldname = 'number-of-volumes';
	            break;

	    }
	    if (fieldname != "selectfield") {
	    	var input = '<text variable="' + fieldname;
	    	input = input + '"/>';
	    	if (fieldname == 'author' | fieldname == 'editor' | fieldname == 'translator') {
	    	    input = '<names variable="' + fieldname + '"/>';
	    	}
	    	var button = document.createElement("button");
	    	button.setAttribute("id", input);
	    	button.setAttribute("label", fieldname);
	    	button.setAttribute("oncommand", "selectField(event)");


	    	if (selected) {
	    	    pos = cslEditor.value.indexOf(selected);
	    	    insertAtPoint(input, pos);
	    	    ClickableUI.insertBefore(button, document.getElementById(selected).nextSibling);
	    	    Zotero_CSL_Editor.onStyleModified();
	    	}
	    	else {
	    	    var formatname = (format.selectedItem).getAttribute("value");
	    	    temp = "<" + formatname;
	    	    temp2 = "</" + formatname;
	    	    var start = cslEditor.value.indexOf(temp);
	    	    var end = cslEditor.value.indexOf(temp2);
	    	    res = (cslEditor.value.substring(start, end));
	    	    pos = start;
	    	    start = res.indexOf("<layout");
	    	    end = res.indexOf("</layout");
	    	    res = (res.substring(start, end));
	    	    pos = pos + start + res.indexOf(">") + 1;
	    	    insertAtPoint(input, pos);
	    	    ClickableUI.insertBefore(button, ClickableUI.firstChild);
	    	    Zotero_CSL_Editor.onStyleModified();
	    	}
	    	
	    }
	    else {
	        Zotero_CSL_Editor.onStyleModified();
		    return;
	    }
	    
	    
        // Do something depending on field
	}

       
	removeField = function () {
	    var element = document.getElementById(selected);
	    if (element) {
	        var formatname = (format.selectedItem).getAttribute("value");
	        cslEditor.value.replace(selected, '');
	        var start = cslEditor.value.indexOf("<" + formatname);
	        var end = cslEditor.value.indexOf("</" + formatname);
	        res = cslEditor.value.substring(start, end);
	        res = res.replace(selected, "");
	        cslEditor.value = cslEditor.value.substring(0, start) + res + cslEditor.value.substring(end, cslEditor.length);
	        element.parentNode.removeChild(element);
	        selected = undefined;
	        Zotero_CSL_Editor.onStyleModified();
	    }

	}


	this.onUnload = function() {

	}
	
	this.onBeforeUnload = function() {

	}
}

window.addEventListener("load", function(e) { CiteOverlay.onLoad(e); }, false);
window.addEventListener("unload", function(e) { CiteOverlay.onUnload(e); }, false);
window.addEventListener("beforeunload", function(e) { CiteOverlay.onBeforeUnload(e); }, false);
